import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getContract } from "@/lib/contracts";
import { contractTotals } from "@/lib/contract-totals";
import { company } from "@/data/company";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Contrat de dépôt-vente",
  robots: { index: false, follow: false },
};

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

function longDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function addMonths(iso: string, months: number): Date {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d;
}

/**
 * Affiche la valeur, ou une ligne pointillée à compléter à la main.
 * `suffix` (ponctuation) reste collé au champ pour ne pas passer seul à la ligne.
 */
function Blank({ value, width = "12rem", suffix = "" }: { value?: string; width?: string; suffix?: string }) {
  if (value?.trim()) return <strong>{value}{suffix}</strong>;
  return (
    <span className="whitespace-nowrap">
      <span className="inline-block border-b border-dotted border-text align-bottom" style={{ width }} />
      {suffix}
    </span>
  );
}

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await verifyAdminSession())) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-text-muted mb-4">Session expirée — connectez-vous au back-office pour voir ce contrat.</p>
        <Link href="/admin" className="text-primary font-semibold underline">Aller au back-office</Link>
      </div>
    );
  }

  const { id } = await params;
  const contract = getContract(id);
  if (!contract) notFound();

  const { partner } = contract;
  const totals = contractTotals(contract);
  const start = new Date(contract.startDate);
  const end = addMonths(contract.startDate, contract.durationMonths);
  const items = contract.items.filter((i) => i.qty > 0);

  return (
    <div className="bg-warm pt-24 pb-16 print:bg-white print:p-0">
      <div className="max-w-[210mm] mx-auto mb-6 px-4 flex items-center justify-between print:hidden">
        <Link href="/admin" className="text-sm text-text-muted hover:text-primary">← Retour au back-office</Link>
        <PrintButton />
      </div>

      <article className="contract max-w-[210mm] mx-auto bg-white shadow-lg px-[18mm] py-[16mm] text-[10.5pt] leading-relaxed text-text print:shadow-none print:max-w-none print:p-0">
        <header className="text-center mb-8">
          <p className="text-xs tracking-[0.2em] text-text-muted uppercase">Contrat n° {contract.number}</p>
          <h1 className="font-heading text-2xl font-bold text-primary mt-2">Contrat de dépôt-vente d&apos;ouvrages</h1>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-3" />
        </header>

        <p className="font-semibold mb-2">ENTRE LES SOUSSIGNÉS :</p>
        <p className="mb-3">
          <strong>{company.name}</strong> ({company.acronym}), {company.legalForm} au capital de {company.capital},
          immatriculée au Registre du Commerce et du Crédit Mobilier sous le n° {company.rccm} ({company.rccmCourt})
          {company.ncc && <>, compte contribuable n° {company.ncc}</>}, dont le siège social est situé à {company.address},{" "}
          {company.postalAddress}, téléphone {company.phone}, représentée par {company.representative}, en sa qualité
          de {company.representativeTitle}, dûment habilitée aux fins des présentes,
        </p>
        <p className="mb-3 text-right italic">ci-après dénommée « <strong>le Déposant</strong> »,</p>
        <p className="mb-3 font-semibold">D&apos;UNE PART,</p>

        <p className="mb-3">
          ET <Blank value={partner.name} width="16rem" suffix="," />
          {partner.legalForm && <> {partner.legalForm},</>} immatriculée au RCCM sous le n°{" "}
          <Blank value={partner.rccm} suffix="," />
          {partner.ncc && <> compte contribuable n° {partner.ncc},</>} dont le siège est situé à{" "}
          <Blank value={[partner.address, partner.city].filter(Boolean).join(", ")} width="18rem" suffix="," /> téléphone{" "}
          <Blank value={partner.phone} width="8rem" suffix="," />
          {partner.email && <> email {partner.email},</>} représentée par{" "}
          <Blank value={partner.representative} suffix="," /> en sa qualité de{" "}
          <Blank value={partner.representativeTitle} width="8rem" suffix="," />
        </p>
        <p className="mb-3 text-right italic">ci-après dénommée « <strong>le Dépositaire</strong> »,</p>
        <p className="mb-6 font-semibold">D&apos;AUTRE PART.</p>

        <p className="mb-6">Le Déposant et le Dépositaire étant ci-après dénommés ensemble « les Parties ».</p>

        <h2 className="contract-h2">Préambule</h2>
        <p>
          Le Déposant est une maison d&apos;édition et de communication qui assure la production et la diffusion
          d&apos;ouvrages, notamment ceux du Pasteur Alexandre AMAZOU. Le Dépositaire exploite une librairie et souhaite
          proposer ces ouvrages à sa clientèle. Les Parties se sont rapprochées afin de définir les conditions dans
          lesquelles le Déposant confie des ouvrages au Dépositaire en vue de leur vente, selon le régime du
          dépôt-vente. Ceci exposé, il a été convenu ce qui suit :
        </p>

        <h2 className="contract-h2">Article 1 — Objet</h2>
        <p>
          Le présent contrat a pour objet de définir les conditions dans lesquelles le Déposant remet en dépôt au
          Dépositaire, qui l&apos;accepte, les ouvrages désignés au bordereau de dépôt figurant en Annexe 1, afin
          qu&apos;il les vende au public pour le compte du Déposant.
        </p>

        <h2 className="contract-h2">Article 2 — Propriété des ouvrages</h2>
        <p>
          Les ouvrages déposés demeurent la propriété exclusive du Déposant jusqu&apos;à leur vente au client final.
          Le Dépositaire ne peut ni les céder à un autre revendeur, ni les donner en garantie, ni les déplacer hors de
          son point de vente sans l&apos;accord écrit préalable du Déposant.
        </p>

        <h2 className="contract-h2">Article 3 — Remise des ouvrages</h2>
        <p>
          Chaque remise d&apos;ouvrages fait l&apos;objet d&apos;un bordereau de dépôt établi en deux exemplaires,
          indiquant les titres, les quantités et les prix publics, signé par les deux Parties après vérification
          contradictoire. Le bordereau initial figure en Annexe 1. Tout réassort fera l&apos;objet d&apos;un nouveau
          bordereau, qui sera annexé au présent contrat.
        </p>

        <h2 className="contract-h2">Article 4 — Prix de vente</h2>
        <p>
          Les ouvrages sont vendus au public au prix fixé par le Déposant, indiqué en francs CFA au bordereau de
          dépôt. Le Dépositaire s&apos;engage à respecter ce prix et à ne consentir aucune remise sans l&apos;accord
          écrit du Déposant. Le Déposant peut modifier ses prix publics moyennant une information écrite préalable
          de quinze (15) jours.
        </p>

        <h2 className="contract-h2">Article 5 — Rémunération du Dépositaire</h2>
        <p>
          En contrepartie de ses services, le Dépositaire perçoit une commission de{" "}
          <strong>{contract.commissionRate} % du prix public</strong> de chaque ouvrage effectivement vendu et payé
          par le client. Cette commission est sa seule rémunération ; elle couvre l&apos;ensemble de ses frais de
          stockage, de présentation et de vente. Aucune commission n&apos;est due sur les ouvrages invendus, perdus
          ou détériorés.
        </p>

        <h2 className="contract-h2">Article 6 — Relevé des ventes et paiement</h2>
        <p>
          Au plus tard le <strong>{contract.reportDay} de chaque mois</strong>, le Dépositaire adresse au Déposant un
          relevé des ventes du mois écoulé, indiquant par titre les quantités vendues et le stock restant. Le
          Dépositaire verse au Déposant le produit des ventes, déduction faite de sa commission, dans un délai de{" "}
          <strong>{contract.paymentDays} jours</strong> suivant la transmission du relevé, par virement bancaire,
          Mobile Money ou en espèces contre reçu. Le Déposant peut, à tout moment et sur simple demande, procéder ou
          faire procéder à un inventaire contradictoire des ouvrages en dépôt.
        </p>

        <h2 className="contract-h2">Article 7 — Garde et responsabilité</h2>
        <p>
          Le Dépositaire assure la garde des ouvrages avec le soin d&apos;un bon professionnel. Il est responsable de
          leur perte, de leur vol ou de leur détérioration, quelle qu&apos;en soit la cause, à compter de leur remise
          et jusqu&apos;à leur vente ou leur restitution. Tout ouvrage manquant ou rendu invendable lors d&apos;un
          inventaire est réputé vendu et facturé au prix public, déduction faite de la commission prévue à
          l&apos;article 5.
        </p>

        <h2 className="contract-h2">Article 8 — Présentation et promotion</h2>
        <p>
          Le Dépositaire s&apos;engage à présenter les ouvrages de manière visible dans son point de vente et à les
          proposer activement à sa clientèle. Le Déposant peut fournir des supports promotionnels (affiches,
          présentoirs, marque-pages) et organiser, en accord avec le Dépositaire, des séances de dédicace ou de
          présentation.
        </p>

        <h2 className="contract-h2">Article 9 — Retours et invendus</h2>
        <p>
          Le Déposant peut reprendre à tout moment tout ou partie des ouvrages invendus. À l&apos;expiration ou à la
          résiliation du contrat, le Dépositaire restitue les invendus en bon état, dans un délai de quinze (15) jours,
          et procède au règlement du solde des ventes. Les frais de reprise des invendus sont à la charge du Déposant,
          sauf en cas de résiliation pour manquement du Dépositaire.
        </p>

        <h2 className="contract-h2">Article 10 — Durée</h2>
        <p>
          Le présent contrat prend effet le <strong>{longDate(start)}</strong> pour une durée de{" "}
          <strong>{contract.durationMonths} mois</strong>, soit jusqu&apos;au {longDate(end)}. Il se renouvelle
          ensuite par tacite reconduction pour des périodes successives de même durée, sauf dénonciation par
          l&apos;une des Parties dans les conditions de l&apos;article 11.
        </p>

        <h2 className="contract-h2">Article 11 — Résiliation</h2>
        <p>
          Chaque Partie peut mettre fin au contrat à tout moment, par lettre remise contre décharge ou par courrier
          électronique avec accusé de réception, moyennant un préavis de <strong>{contract.noticeDays} jours</strong>.
          En cas de manquement grave de l&apos;une des Parties à ses obligations, notamment le défaut de paiement des
          sommes dues, l&apos;autre Partie peut résilier le contrat sans préavis, huit (8) jours après une mise en
          demeure restée sans effet.
        </p>

        <h2 className="contract-h2">Article 12 — Absence d&apos;exclusivité</h2>
        <p>
          Le présent contrat n&apos;emporte aucune exclusivité. Le Déposant reste libre de commercialiser ses ouvrages
          par tout autre canal, y compris auprès d&apos;autres librairies et en ligne.
        </p>

        {contract.notes.trim() && (
          <>
            <h2 className="contract-h2">Article 13 — Clauses particulières</h2>
            <p className="whitespace-pre-line">{contract.notes}</p>
          </>
        )}

        <h2 className="contract-h2">Article {contract.notes.trim() ? 14 : 13} — Droit applicable et litiges</h2>
        <p>
          Le présent contrat est régi par le droit ivoirien et l&apos;Acte uniforme OHADA relatif au droit commercial
          général. Les Parties s&apos;efforceront de régler à l&apos;amiable tout différend relatif à son
          interprétation ou à son exécution. À défaut d&apos;accord dans un délai de trente (30) jours, le litige sera
          porté devant le Tribunal de Commerce d&apos;Abidjan.
        </p>

        <p className="mt-8">
          Fait à <strong>{contract.signingPlace || "Abidjan"}</strong>, le <Blank width="10rem" />, en deux (2)
          exemplaires originaux, dont un pour chaque Partie.
        </p>

        <div className="grid grid-cols-2 gap-10 mt-8 break-inside-avoid">
          <div>
            <p className="font-semibold">Pour le Déposant</p>
            <p className="text-sm">{company.name}</p>
            <p className="text-sm">{company.representative}, {company.representativeTitle}</p>
            <p className="text-xs text-text-muted mt-1">Signature et cachet, précédés de la mention « Lu et approuvé »</p>
            <div className="h-28 border border-dashed border-warm rounded mt-2" />
          </div>
          <div>
            <p className="font-semibold">Pour le Dépositaire</p>
            <p className="text-sm">{partner.name}</p>
            <p className="text-sm">{partner.representative}{partner.representativeTitle && `, ${partner.representativeTitle}`}</p>
            <p className="text-xs text-text-muted mt-1">Signature et cachet, précédés de la mention « Lu et approuvé »</p>
            <div className="h-28 border border-dashed border-warm rounded mt-2" />
          </div>
        </div>

        {/* Annexe 1 */}
        <section className="break-before-page mt-12 print:mt-0">
          <h2 className="font-heading text-xl font-bold text-primary text-center">Annexe 1 — Bordereau de dépôt initial</h2>
          <p className="text-center text-sm text-text-muted mb-6">
            Contrat n° {contract.number} — {partner.name} — remise du <Blank width="8rem" />
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-warm print:bg-gray-100">
                <th className="border border-warm text-left px-2 py-1.5">Titre</th>
                <th className="border border-warm text-right px-2 py-1.5 w-14">Qté</th>
                <th className="border border-warm text-right px-2 py-1.5 w-24">Prix public</th>
                <th className="border border-warm text-right px-2 py-1.5 w-28">Montant</th>
                <th className="border border-warm text-right px-2 py-1.5 w-28">Net Déposant</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const amount = item.qty * item.unitPrice;
                return (
                  <tr key={item.slug}>
                    <td className="border border-warm px-2 py-1.5">{item.title}</td>
                    <td className="border border-warm px-2 py-1.5 text-right">{item.qty}</td>
                    <td className="border border-warm px-2 py-1.5 text-right">{fmt(item.unitPrice)}</td>
                    <td className="border border-warm px-2 py-1.5 text-right">{fmt(amount)}</td>
                    <td className="border border-warm px-2 py-1.5 text-right">
                      {fmt(amount * (1 - contract.commissionRate / 100))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="font-semibold">
              <tr>
                <td className="border border-warm px-2 py-1.5">Total</td>
                <td className="border border-warm px-2 py-1.5 text-right">{totals.qty}</td>
                <td className="border border-warm px-2 py-1.5" />
                <td className="border border-warm px-2 py-1.5 text-right">{fmt(totals.value)}</td>
                <td className="border border-warm px-2 py-1.5 text-right">{fmt(totals.net)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-xs text-text-muted mt-2">
            Montants en francs CFA. Commission du Dépositaire : {contract.commissionRate} % du prix public, soit{" "}
            {fmt(totals.commission)} FCFA si l&apos;intégralité du dépôt est vendue.
          </p>

          <div className="grid grid-cols-2 gap-10 mt-10 break-inside-avoid">
            <div>
              <p className="font-semibold text-sm">Remis par le Déposant</p>
              <div className="h-20 border border-dashed border-warm rounded mt-2" />
            </div>
            <div>
              <p className="font-semibold text-sm">Reçu et vérifié par le Dépositaire</p>
              <div className="h-20 border border-dashed border-warm rounded mt-2" />
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
