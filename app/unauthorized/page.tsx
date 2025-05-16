// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Unauthorized</h1>
      <p className="mt-4 text-gray-600">You do not have permission to access this page.</p>
    </div>
  );
}