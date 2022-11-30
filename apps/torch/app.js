{
  const SETTINGS_FILE = "torch.json";
  let settings;
  let s = require("Storage");
  let wu = require("widget_utils");

  let loadSettings = function() {
    settings = s.readJSON(SETTINGS_FILE,1)|| {'bg': '#FFFFFF', 'color': 'White'};
  };

  loadSettings();

  let brightnessBackup = s.readJSON('setting.json').brightness;
  let optionsBackup = Bangle.getOptions();
  Bangle.setLCDBrightness(1);
  Bangle.setLCDPower(1);
  Bangle.setLCDTimeout(0);
  g.reset();
  let themeBackup = g.theme;
  g.setTheme({bg:settings.bg,fg:"#000"});
  g.setColor(settings.bg);
  g.fillRect(0,0,g.getWidth(),g.getHeight());
  if (s.read('fastload.cache')!==undefined) {
    Bangle.loadWidgets();
    if (process.env.HWVERSION==1) wu.hide();
    if (process.env.HWVERSION==2) wu.swipeOn();
  }
  Bangle.setUI({
    mode : 'custom',
    back : Bangle.showClock, // B2: SW back button to exit
    btn :  _=>Bangle.showClock(), // B1&2: HW button to exit. 
    remove : ()=>{
      Bangle.setLCDBrightness(brightnessBackup);
      Bangle.setOptions(optionsBackup);
      g.setTheme(themeBackup);
      wu.show();
    }
  });
}

