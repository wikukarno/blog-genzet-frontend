"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllCategories } from "@/hooks/use-all-categories";
import { useUpdateArticle } from "@/hooks/use-update-article";
import { ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getArticleByID } from "@/services/article-service";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  { ssr: false },
);

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );

  const { mutate, isPending } = useUpdateArticle();
  const { data: categories = [] } = useAllCategories();

  const [form, setForm] = useState({
    title: "",
    category_id: undefined as number | undefined,
    content: "",
    thumbnail: undefined as File | undefined,
  });

  useEffect(() => {
    axios
      .get("/api/tinymce-key")
      .then((res) => setApiKey(res.data.key))
      .catch(() => toast.error("Failed to load TinyMCE key"));
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await getArticleByID(id);
        setForm({
          title: article.title,
          category_id: article.category?.id ?? undefined,
          content: article.content,
          thumbnail: undefined,
        });
        setExistingThumbnail(article.thumbnail);
      } catch {
        toast.error("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  const handleSubmit = () => {
    if (!form.title || !form.category_id || !form.content) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category_id", String(form.category_id));
    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail);
    }

    mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Article updated");
          router.push("/admin/articles");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm">
        Loading article...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/articles">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Edit Article</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-6">
        {/* Thumbnail */}
        <div className="space-y-2">
          <label className="font-medium mb-2 block">Thumbnails</label>
          <label
            htmlFor="thumbnail"
            className="h-40 w-full max-w-md flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition text-center overflow-hidden"
          >
            {form.thumbnail ? (
              <Image
                src={URL.createObjectURL(form.thumbnail)}
                alt="New Thumbnail"
                className="h-full w-full object-cover rounded-md"
                width={160}
                height={160}
                priority
              />
            ) : existingThumbnail ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${existingThumbnail}`}
                alt="Old Thumbnail"
                className="h-full w-full object-cover rounded-md"
                width={160}
                height={160}
                priority
              />
            ) : (
              <>
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm font-medium text-blue-600 underline">
                  Click to select files
                </span>
              </>
            )}
            <input
              type="file"
              id="thumbnail"
              className="hidden"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  thumbnail: e.target.files?.[0],
                }))
              }
            />
          </label>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="font-medium mb-2 block">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Input title"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="font-medium mb-2 block">Category</label>
          {categories.length > 0 && (
            <Select
              value={String(form.category_id ?? "")}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  category_id: parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category">
                  {categories.find((cat) => cat.id === form.category_id)
                    ?.name ?? ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="font-medium mb-2 block">Content</label>
          {apiKey && (
            <Editor
              apiKey={apiKey}
              value={form.content}
              onEditorChange={(content) =>
                setForm((prev) => ({ ...prev, content }))
              }
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "fullscreen",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/articles")}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Upload className="w-4 h-4 mr-1" />
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
