"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateArticle } from "@/hooks/use-create-article";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAllCategories } from "@/hooks/use-all-categories";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  {
    ssr: false,
  },
);

export default function CreateArticlePage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateArticle();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useAllCategories();

  const [apiKey, setApiKey] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
    thumbnail: "",
  });

  useEffect(() => {
    axios
      .get("/api/tinymce-key")
      .then((res) => setApiKey(res.data.key))
      .catch((err) => console.error("Failed to fetch TinyMCE key", err));
  }, []);

  const [form, setForm] = useState({
    title: "",
    category_id: undefined as number | undefined,
    content: "",
    thumbnail: undefined as File | undefined,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCategory = (value: string) => {
    setForm((prev) => ({ ...prev, category_id: parseInt(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, thumbnail: file }));
  };

  const handlePreview = () => {
    const previewData = {
      title: form.title,
      content: form.content,
      thumbnail: form.thumbnail ? URL.createObjectURL(form.thumbnail) : null,
      author: "Admin",
      created_at: new Date().toISOString(),
    };

    const slug = form.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    if (!slug) {
      toast.error("Title is required for preview");
      return;
    }

    sessionStorage.setItem("preview-article", JSON.stringify(previewData));
    window.open(`/articles/preview`, "_blank");
  };

  const handleSubmit = () => {
    let hasError = false;
    const newErrors = {
      title: "",
      category: "",
      content: "",
      thumbnail: "",
    };

    if (!form.thumbnail) {
      newErrors.thumbnail = "Please enter picture";
      hasError = true;
    }
    if (!form.title) {
      newErrors.title = "Please enter title";
      hasError = true;
    }
    if (!form.category_id) {
      newErrors.category = "Please select category";
      hasError = true;
    }
    if (
      !form.content ||
      form.content.replace(/<[^>]+>/g, "").trim().length === 0
    ) {
      newErrors.content = "Content field cannot be empty";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category_id", String(form.category_id));
    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail);
    }

    mutate(formData, {
      onSuccess: () => {
        router.push("/admin/articles");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/articles">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Create Articles</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-6">
        <div className="space-y-2">
          <label className="font-medium mb-2 block">Thumbnails</label>
          <label
            htmlFor="thumbnail"
            className="h-40 w-full max-w-md flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition text-center overflow-hidden"
          >
            {form.thumbnail ? (
              <Image
                src={URL.createObjectURL(form.thumbnail)}
                alt="Thumbnail Preview"
                className="h-full w-full object-cover rounded-md"
                width={160}
                height={160}
              />
            ) : (
              <>
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm font-medium text-blue-600 underline">
                  Click to select files
                </span>
                <span className="text-xs text-gray-400">
                  Support File Type : .jpg or .png
                </span>
              </>
            )}
            <input
              type="file"
              id="thumbnail"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {errors.thumbnail && (
            <p className="text-sm text-red-600 mt-1">{errors.thumbnail}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-medium mb-2 block">Title</label>
          <Input
            placeholder="Input title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-medium mb-2 block">Category</label>
          <Select onValueChange={handleSelectCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories || categories.length === 0 ? (
                <SelectItem value="__dummy" disabled>
                  {isLoadingCategories ? "Loading..." : "No categories"}
                </SelectItem>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
          <p className="text-sm text-muted-foreground">
            The existing category list can be seen in the{" "}
            <Link
              href="/admin/categories"
              className="text-blue-600 hover:underline"
            >
              category
            </Link>{" "}
            menu
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-medium mb-2 block">Content</label>
          {apiKey && (
            <Editor
              apiKey={apiKey}
              value={form.content}
              onEditorChange={(newContent) =>
                setForm((prev) => ({ ...prev, content: newContent }))
              }
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          )}
          <p className="text-xs text-muted-foreground">
            {
              form.content
                .replace(/<[^>]+>/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean).length
            }{" "}
            Words
          </p>
          {errors.content && (
            <p className="text-sm text-red-600 mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/articles")}
          >
            Cancel
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <ImageIcon className="w-4 h-4 mr-1" /> Preview
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Upload className="w-4 h-4 mr-1" />{" "}
            {isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
