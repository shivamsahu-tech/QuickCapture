export function Spinner({size = 6}) {
    return (
      <div
        role="status"
        className={`inline-block h-${size} w-${size} animate-spin rounded-full mt-auto border-4 border-t-transparent border-gray-400`}
      />
    );
  }
  