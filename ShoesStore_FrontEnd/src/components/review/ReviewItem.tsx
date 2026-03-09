interface ReviewItemProps {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

const ReviewItem = ({ name, rating, comment, date }: ReviewItemProps) => {
  return (
    <>
      <div className="border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex text-primary mb-1">
              {Array.from({ length: 5 }, (_, i) => {
                if (i + 1 <= rating) {
                  return (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xl!"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xl!"
                      style={{ fontVariationSettings: '"FILL" 0' }}
                    >
                      star
                    </span>
                  );
                }
              })}
            </div>
            <h4 className="font-extrabold text-lg">Stylish and Functional</h4>
            <span className="text-sm text-gray-500">
              <span className="text-black dark:text-white font-bold">
                {name}
              </span>{" "}
              • {formatTimeAgo(date)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <span className="material-symbols-outlined text-sm!">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Verified Purchase
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{comment}</p>
      </div>
    </>
  );
};

export default ReviewItem;
