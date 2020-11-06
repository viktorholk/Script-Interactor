using System;
using System.IO;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using System.Windows;
using System.Diagnostics;

namespace Script_Interactor
{
    public class ScriptsHandler
    {
        private string folderName = "scripts";

        private string folderMetaData;

        private List<Script> scripts;

        public ScriptsHandler()
        {
            folderMetaData = Path.Combine(folderName, "MetaData");
            if (!Directory.Exists(folderName))
            {
                Directory.CreateDirectory(folderName);
            }
            if (!Directory.Exists(folderMetaData))
            {
                Directory.CreateDirectory(folderMetaData);
            }

            this.scripts = LoadScripts();
        }

        public List<Script> get()
        {
            this.scripts = LoadScripts();
            return this.scripts;
        }

        private List<Script> LoadScripts()
        {
            scripts = new List<Script>();
            // First we go through all the scripts and match if there is a metadata file, because we need one.
            string[] files = Directory.GetFiles(folderName);
            foreach (var f in files)
            {
                var fileName = Path.GetFileNameWithoutExtension(f);
                var metaDataName = fileName + ".json";

                if (!File.Exists(Path.Combine(folderMetaData, metaDataName)))
                {
                    var metaData = new Script()
                    {
                        scriptName = Path.GetFileName(f),
                        metaDataName = metaDataName
                    };
                    CreateMetadata(metaData, metaDataName);
                }
            }
            // Now when we know every script file has a metadata now we can read then all and return them
            List<Script> _scripts = new List<Script>();
            string[] metaDataFiles = Directory.GetFiles(folderMetaData, "*.json");
            foreach (var item in metaDataFiles)
            {
                var json_read = File.ReadAllText(item);
                _scripts.Add(JsonConvert.DeserializeObject<Script>(json_read));
            }

            return _scripts;

        }

        public void RunScript(Script script)
        {
            if (script.enabled)
            {
                Process.Start("cmd.exe", $"start {script.scriptName}");
            }
        }
        private void CreateMetadata(Script metaData,string fileName)
        {
            var json = JsonConvert.SerializeObject(metaData, Formatting.Indented);
            File.WriteAllText(Path.Combine(folderMetaData, fileName), json);
        }

        public void SaveMetadata(Script newMetaData)
        {
            var fileName = newMetaData.metaDataName;
            var json = JsonConvert.SerializeObject(newMetaData, Formatting.Indented);
            File.WriteAllText(Path.Combine(folderMetaData, fileName), json);
            LoadScripts();


        }
    }
}
