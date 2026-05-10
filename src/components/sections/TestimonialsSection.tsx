"use client";

import { FadeInUp } from "@/components/ui/MotionDiv";

const testimonials = [
  {
    name: "Marie K.",
    role: "Membre ABMCI",
    text: "Le livre 'Comment préparer et réussir une nouvelle année' a complètement changé ma façon d'aborder chaque début d'année. Des principes puissants et applicables.",
  },
  {
    name: "Jean-Paul A.",
    role: "Pasteur",
    text: "Les ouvrages du Pasteur Amazou sont d'une profondeur remarquable. 'Le Transfert de l'iniquité par les liens du sang' est un incontournable pour tout croyant.",
  },
  {
    name: "Grâce D.",
    role: "Étudiante",
    text: "'Réussir sa vie' m'a donné une nouvelle perspective sur mon avenir. Chaque page est une source d'inspiration et de révélation divine.",
  },
  {
    name: "Emmanuel T.",
    role: "Entrepreneur",
    text: "'Devenez riche pour Dieu' m'a réconcilié avec la prospérité selon Dieu. Un enseignement équilibré et transformateur.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">
              Ce que disent nos lecteurs
            </h2>
            <p className="text-text-muted">
              Des vies transformées par la puissance de la Parole
            </p>
          </div>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <FadeInUp key={testimonial.name} delay={index * 0.1}>
              <div className="bg-white rounded-xl p-6 h-full flex flex-col border border-warm">
                {/* Quote mark */}
                <svg
                  className="w-8 h-8 text-accent/40 mb-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-text-muted text-sm leading-relaxed flex-1 mb-4">
                  {testimonial.text}
                </p>
                <div className="border-t border-warm pt-4">
                  <p className="font-semibold text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-text-muted text-xs">{testimonial.role}</p>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
