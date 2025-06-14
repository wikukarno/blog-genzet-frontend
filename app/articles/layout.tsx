export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-gray-100 text-gray-900">{children}</div>;
}
