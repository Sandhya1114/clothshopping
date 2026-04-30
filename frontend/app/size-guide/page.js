import PageHero from '@/components/layout/PageHero';
import { sizeGuideRows } from '@/lib/site';

export default function SizeGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Sizing"
        title="Quick size guide"
        text="Use this sample chart as a starting point, then refine it for your exact product measurements and fit notes."
      />
      <section className="container section-spacing">
        <div className="table-wrap">
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Hips</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuideRows.map((row) => (
                <tr key={row.size}>
                  <td>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
