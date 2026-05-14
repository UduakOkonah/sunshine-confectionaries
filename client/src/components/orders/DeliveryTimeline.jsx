import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";

const steps = [
  {
    id: 1,
    status: "Pending",
    icon: Clock3,
  },
  {
    id: 2,
    status: "Approved",
    icon: PackageCheck,
  },
  {
    id: 3,
    status: "Out for Delivery",
    icon: Truck,
  },
  {
    id: 4,
    status: "Delivered",
    icon: CheckCircle2,
  },
];

function DeliveryTimeline({ currentStatus }) {
  const currentStepIndex = steps.findIndex(
    (step) => step.status === currentStatus
  );

  return (
    <div className="relative">
      <div className="absolute left-[22px] top-0 h-full w-1 rounded-full bg-slate-200" />

      <div className="space-y-8">
        {steps.map((step, index) => {
          const completed = index <= currentStepIndex;

          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative flex items-start gap-5"
            >
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition ${
                  completed
                    ? "bg-green-500 text-white"
                    : "bg-white text-slate-400"
                }`}
              >
                <Icon size={20} />
              </div>

              <div className="pt-1">
                <h3
                  className={`text-lg font-black ${
                    completed
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.status}
                </h3>

                <p
                  className={`mt-1 text-sm ${
                    completed
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {completed
                    ? `Order ${step.status.toLowerCase()}`
                    : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeliveryTimeline;