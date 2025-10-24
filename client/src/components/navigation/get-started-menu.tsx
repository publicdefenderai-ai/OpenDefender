import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Globe, 
  Shield, 
  Calendar, 
  Search, 
  Users,
  ChevronRight,
  ArrowLeft,
  MapPin,
  HelpCircle,
  Route,
  Eraser,
  Book,
  Home as HomeIcon
} from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

interface GetStartedMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowPublicDefender?: () => void;
  onShowLegalAid?: () => void;
}

type MenuLevel = "main" | "legal-rights" | "legal-aid";

export function GetStartedMenu({ isOpen, onClose, onShowPublicDefender, onShowLegalAid }: GetStartedMenuProps) {
  const [, setLocation] = useLocation();
  const [currentMenu, setCurrentMenu] = useState<MenuLevel>("main");
  const { t } = useTranslation();

  const handleNavigate = (path: string) => {
    setLocation(path);
    onClose();
    setCurrentMenu("main");
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleShowPublicDefender = () => {
    onClose();
    setCurrentMenu("main");
    if (onShowPublicDefender) {
      setTimeout(() => onShowPublicDefender(), 100);
    }
  };

  const handleShowLegalAid = () => {
    onClose();
    setCurrentMenu("main");
    if (onShowLegalAid) {
      setTimeout(() => onShowLegalAid(), 100);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentMenu("main");
  };

  const goBack = () => {
    setCurrentMenu("main");
  };

  // Main menu
  const mainMenu = (
    <div className="space-y-3">
      <button
        onClick={() => handleNavigate('/case-guidance')}
        className="w-full"
        data-testid="menu-item-case-guidance"
      >
        <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                  {t('getStartedMenu.main.caseGuidance.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('getStartedMenu.main.caseGuidance.description')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/immigration-guidance')}
        className="w-full"
        data-testid="menu-item-immigration"
      >
        <Card className="hover:shadow-lg hover:border-amber-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg group-hover:text-amber-600 transition-colors">
                  {t('getStartedMenu.main.immigration.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('getStartedMenu.main.immigration.description')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => setCurrentMenu("legal-rights")}
        className="w-full"
        data-testid="menu-item-legal-rights"
      >
        <Card className="hover:shadow-lg hover:border-green-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg group-hover:text-green-600 transition-colors">
                  {t('getStartedMenu.main.legalRights.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('getStartedMenu.main.legalRights.description')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => setCurrentMenu("legal-aid")}
        className="w-full"
        data-testid="menu-item-legal-aid-resources"
      >
        <Card className="hover:shadow-lg hover:border-purple-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                  {t('getStartedMenu.main.legalAid.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('getStartedMenu.main.legalAid.description')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </button>
    </div>
  );

  // Legal Rights submenu
  const legalRightsMenu = (
    <div className="space-y-3">
      <Button
        variant="ghost"
        onClick={goBack}
        className="mb-2"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('getStartedMenu.legalRightsSubmenu.backButton')}
      </Button>

      <button
        onClick={() => handleNavigate('/rights-info')}
        className="w-full"
        data-testid="submenu-item-constitutional-rights"
      >
        <Card className="hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium group-hover:text-blue-600 transition-colors">
                {t('getStartedMenu.legalRightsSubmenu.constitutionalRights')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/process')}
        className="w-full"
        data-testid="submenu-item-criminal-justice-process"
      >
        <Card className="hover:shadow-md hover:border-green-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium group-hover:text-green-600 transition-colors">
                {t('getStartedMenu.legalRightsSubmenu.criminalJusticeProcess')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/search-seizure')}
        className="w-full"
        data-testid="submenu-item-search-seizure"
      >
        <Card className="hover:shadow-md hover:border-purple-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-purple-600" />
              <span className="font-medium group-hover:text-purple-600 transition-colors">
                {t('getStartedMenu.legalRightsSubmenu.searchSeizure')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/friends-family')}
        className="w-full"
        data-testid="submenu-item-assisting-friends-family"
      >
        <Card className="hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <HomeIcon className="h-5 w-5 text-indigo-600" />
              <span className="font-medium group-hover:text-indigo-600 transition-colors">
                {t('getStartedMenu.legalRightsSubmenu.assistingFriends')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/legal-glossary')}
        className="w-full"
        data-testid="submenu-item-legal-glossary"
      >
        <Card className="hover:shadow-md hover:border-orange-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Book className="h-5 w-5 text-orange-600" />
              <span className="font-medium group-hover:text-orange-600 transition-colors">
                {t('getStartedMenu.legalRightsSubmenu.legalGlossary')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>
    </div>
  );

  // Legal Aid Resources submenu
  const legalAidMenu = (
    <div className="space-y-3">
      <Button
        variant="ghost"
        onClick={goBack}
        className="mb-2"
        data-testid="button-back-aid"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('getStartedMenu.legalAidSubmenu.backButton')}
      </Button>

      <button
        onClick={handleShowPublicDefender}
        className="w-full"
        data-testid="submenu-item-public-defender"
      >
        <Card className="hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-medium group-hover:text-blue-600 transition-colors">
                {t('getStartedMenu.legalAidSubmenu.publicDefender')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={handleShowLegalAid}
        className="w-full"
        data-testid="submenu-item-legal-aid-orgs"
      >
        <Card className="hover:shadow-md hover:border-green-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium group-hover:text-green-600 transition-colors">
                {t('getStartedMenu.legalAidSubmenu.legalAidOrgs')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/diversion-programs')}
        className="w-full"
        data-testid="submenu-item-diversion-programs"
      >
        <Card className="hover:shadow-md hover:border-purple-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Route className="h-5 w-5 text-purple-600" />
              <span className="font-medium group-hover:text-purple-600 transition-colors">
                {t('getStartedMenu.legalAidSubmenu.diversionPrograms')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>

      <button
        onClick={() => handleNavigate('/record-expungement')}
        className="w-full"
        data-testid="submenu-item-record-expungement"
      >
        <Card className="hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Eraser className="h-5 w-5 text-indigo-600" />
              <span className="font-medium group-hover:text-indigo-600 transition-colors">
                {t('getStartedMenu.legalAidSubmenu.recordsExpungement')}
              </span>
            </div>
          </CardContent>
        </Card>
      </button>
    </div>
  );

  const getMenuTitle = () => {
    switch (currentMenu) {
      case "legal-rights":
        return t('getStartedMenu.legalRightsSubmenu.title');
      case "legal-aid":
        return t('getStartedMenu.legalAidSubmenu.title');
      default:
        return t('getStartedMenu.main.title');
    }
  };

  const getMenuContent = () => {
    switch (currentMenu) {
      case "legal-rights":
        return legalRightsMenu;
      case "legal-aid":
        return legalAidMenu;
      default:
        return mainMenu;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {getMenuTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {getMenuContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
