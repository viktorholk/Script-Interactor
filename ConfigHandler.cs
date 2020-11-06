using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Reflection;
using TwitchLib.Api.Core.Models.Undocumented.Comments;
using System.Windows;

namespace Script_Interactor
{
    public class ConfigHandler
    {
        private string jsonFile = @"config.json";

        private Config config;

        public ConfigHandler()
        {
            config = get();
        }

        public Config get()
        {
            if (File.Exists(jsonFile))
            {
                return loadFile();
            }
            return null;
        }

        public void SaveConfig(Config savedConfig)
        { 
            // We loop through the class of Config and compare the variables to eachother and if they are not equal we update the config and write
            foreach (PropertyInfo prop in typeof(Config).GetProperties())
            {
                var i = prop.GetValue(config, null).ToString();
                var y = prop.GetValue(savedConfig, null).ToString();
                if (i != y)
                {
                    prop.SetValue(config, y);
                }
            }
            WriteConfig();
        }

        private void WriteConfig()
        {
            string output = JsonConvert.SerializeObject(config, Formatting.Indented);
            File.WriteAllText(jsonFile, output);

        }

        private Config loadFile()
        {
            var json_read = File.ReadAllText(jsonFile);
            return JsonConvert.DeserializeObject<Config>(json_read);
        }
    }

}
