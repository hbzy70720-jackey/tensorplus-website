interface Spec {
  param: string;
  value: string;
}

interface SpecTableProps {
  specs: Spec[];
}

export default function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              参数
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              规格
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, i) => (
            <tr
              key={spec.param}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
            >
              <td className="px-6 py-4 text-sm font-medium text-[var(--text-dark)]">
                {spec.param}
              </td>
              <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
