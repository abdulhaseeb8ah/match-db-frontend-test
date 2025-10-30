import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Palette } from "lucide-react";

const themes = [
  {
    id: "corporate",
    name: "Professional Corporate",
    description: "Clean, corporate aesthetic with navy blue and white color scheme",
    colors: {
      primary: "hsl(215, 28%, 17%)",
      secondary: "hsl(0, 0%, 100%)",
      accent: "hsl(210, 40%, 94%)",
      background: "hsl(210, 40%, 98%)",
    },
    preview: "bg-gradient-to-r from-slate-800 to-slate-600"
  },
  {
    id: "modern",
    name: "Modern Tech Startup", 
    description: "Vibrant color palette with DataBricks-inspired oranges and blues",
    colors: {
      primary: "hsl(14, 90%, 60%)",
      secondary: "hsl(215, 28%, 17%)",
      accent: "hsl(210, 40%, 94%)",
      background: "hsl(210, 40%, 98%)",
    },
    preview: "bg-gradient-to-r from-orange-500 to-blue-800",
    isActive: true
  },
  {
    id: "scientific",
    name: "Data-Focused Scientific",
    description: "Clean, analytical design with data visualization aesthetics",
    colors: {
      primary: "hsl(220, 70%, 50%)",
      secondary: "hsl(160, 60%, 45%)",
      accent: "hsl(200, 30%, 90%)",
      background: "hsl(0, 0%, 98%)",
    },
    preview: "bg-gradient-to-r from-blue-600 to-green-600"
  }
];

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("modern");

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      // Apply theme colors to CSS custom properties
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Design Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className="relative">
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => applyTheme(theme.id)}
                data-testid={`theme-${theme.id}`}
              >
                <CardContent className="p-4">
                  <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`}></div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{theme.name}</h4>
                    {selectedTheme === theme.id && (
                      <Badge variant="default" className="h-5 px-2">
                        <Check className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {theme.description}
                  </p>
                  
                  <div className="flex space-x-1 mt-3">
                    {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                      <div 
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {theme.isActive && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 text-xs"
                  data-testid="badge-current-theme"
                >
                  Current
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => applyTheme(selectedTheme)}
            data-testid="button-apply-theme"
          >
            Apply Selected Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
