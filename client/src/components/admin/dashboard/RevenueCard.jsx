import { motion } from "framer-motion";

function RevenueCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  description,
}) {
  return (
    <motion.article
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      className="overflow-hidden rounded-[32px] bg-white p-6 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-sm font-bold text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-[24px] ${color}`}
        >
          <Icon size={30} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
          +{change}%
        </span>

        <p className="text-xs font-bold text-slate-500">
          from last month
        </p>
      </div>
    </motion.article>
  );
}

export default RevenueCard;