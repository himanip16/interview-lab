export default function MessageInput() {
  return (
    <div className="border-t p-4">
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-lg border px-4 py-3"
          placeholder="Explain your design..."
        />

        <button className="rounded-lg bg-blue-600 px-6 text-white">
          Send
        </button>
      </div>
    </div>
  );
}