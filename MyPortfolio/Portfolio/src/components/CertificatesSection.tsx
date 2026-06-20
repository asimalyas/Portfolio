import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ExternalLink, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AchievementCategory } from "../../shared/portfolio.js";
import { usePortfolioData } from "@/hooks/usePortfolioData";

type FilterCat = "All" | AchievementCategory;

export default function CertificatesSection() {
  const { data: portfolioData } = usePortfolioData();
  const certificates = useMemo(() => portfolioData.certificates || [], [portfolioData.certificates]);
  const [filter, setFilter] = useState<FilterCat>("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = useMemo(() => {
    const values = Array.from(new Set(certificates.flatMap((certificate) => certificate.categories)));
    return ["All", ...values] as FilterCat[];
  }, [certificates]);

  const getCount = (cat: FilterCat) => {
    if (cat === "All") return certificates.length;
    return certificates.filter((certificate) => certificate.categories.includes(cat)).length;
  };

  const filtered = filter === "All" ? certificates : certificates.filter((certificate) => certificate.categories.includes(filter));
  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Certificates
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Verified courses, workshops, credentials, and professional learning certificates.
          </p>
        </motion.div>

        {certificates.length > 0 && (
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setVisibleCount(6);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === cat
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === cat ? "bg-white/20" : "bg-background text-muted-foreground"}`}>
                  {getCount(cat)}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {visible.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((certificate, i) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 h-full">
                  <button
                    type="button"
                    className="relative w-full h-52 overflow-hidden text-left"
                    onClick={() => certificate.image && setSelectedImage(certificate.image)}
                    aria-label={certificate.image ? `Open ${certificate.title} certificate image` : certificate.title}
                  >
                    {certificate.image ? (
                      <img
                        src={certificate.image}
                        alt={certificate.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <Award className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    {certificate.dateLabel && (
                      <span className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        {certificate.dateLabel}
                      </span>
                    )}
                  </button>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {certificate.title}
                    </h3>
                    {certificate.issuer && <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-2">{certificate.issuer}</p>}
                    {certificate.description && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{certificate.description}</p>}
                    <div className="flex flex-wrap items-center gap-2">
                      {certificate.categories.map((category) => (
                        <span key={category} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                          {category}
                        </span>
                      ))}
                      {certificate.credentialUrl && (
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View Credential
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Certificates added from the admin dashboard will appear here.
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              onClick={() => setVisibleCount((p) => p + 6)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
            >
              Show More
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[85vh] bg-card rounded-2xl shadow-2xl flex items-center justify-center p-4 border border-border"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedImage} alt="Certificate preview" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


