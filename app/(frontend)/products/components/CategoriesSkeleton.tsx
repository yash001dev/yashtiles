export default function CategoriesSkeleton() {
  return (
    <div className="mb-4 animate-pulse">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-12 bg-gray-200 rounded-full flex-shrink-0"
            style={{ width: `${Math.random() * 40 + 80}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
