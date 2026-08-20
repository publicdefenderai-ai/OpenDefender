import { Github, Twitter } from "lucide-react";
import { BrandLogo, BrandShieldIcon } from "@/components/brand-logo";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-700 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <BrandLogo variant="light" size="md" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex items-start gap-1.5 text-gray-400 text-xs leading-relaxed mb-6">
              <BrandShieldIcon size={13} light className="mt-0.5 opacity-60" />
              <span>{t('footer.privacyNotice')}</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/publicdefenderai-ai/OpenDefender"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                data-testid="link-github"
                aria-label="OpenDefender on GitHub"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
                <span>{t('footer.viewOnGithub')}</span>
              </a>
              <a
                href="https://x.com/OpenDefenderAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                aria-label="OpenDefender on X (Twitter)"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
                <span>{t('footer.viewOnX')}</span>
              </a>
            </div>
          </div>

          {/* Get Help Column */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-lg mb-5">{t('footer.getHelp')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/first-24-hours" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.intents.urgent.label', 'Urgent help')}
                </Link>
              </li>
              <li>
                <Link href="/case-guidance" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.getCaseGuidance')}
                </Link>
              </li>
              <li>
                <Link href="/rights-info" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.knowYourRights')}
                </Link>
              </li>
              <li>
                <Link href="/case-timeline" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.intents.stage.label', 'Understand a case stage')}
                </Link>
              </li>
              <li>
                <Link href="/legal-aid" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.intents.legalHelp.label', 'Find a lawyer or resources')}
                </Link>
              </li>
              <li>
                <Link href="/court-locator" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.findLocalCourts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-lg mb-5">{t('footer.about')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/mission-statement" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.ourMission')}
                </Link>
              </li>
              <li>
                <Link href="/right-to-counsel" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.rightToCounsel')}
                </Link>
              </li>
              <li>
                <Link href="/tech-docs" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.forDevelopers')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/disclaimers" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.noticeDisclaimers')}
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.intents.sources.label', 'Verify sources')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1.5">
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            {t('footer.legalDisclaimer')}
          </p>
          <p className="text-gray-300 text-sm text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
