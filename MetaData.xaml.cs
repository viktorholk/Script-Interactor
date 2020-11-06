using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Script_Interactor
{
    /// <summary>
    /// Interaction logic for MetaData.xaml
    /// </summary>
    public partial class MetaData : Window
    {
        private ScriptsHandler scriptsHandler;

        private Script script;
        public MetaData(Script _script)
        {
            InitializeComponent();
            scriptsHandler = new ScriptsHandler();
            script = _script;
            //Load metadata
            enabledCheckBox.IsChecked = script.enabled;
            commandInput.Text = script.scriptCommand;
            scriptInput.Text = script.scriptName;
            timeOutInput.Text = script.timeOut.ToString();
            FollowerOnlyCheckBox.IsChecked = script.followerOnly;
            SubscriberOnlyCheckBox.IsChecked = script.subscriberOnly;
            modOnlyCheckBox.IsChecked = script.modOnly;

        }

        public void SaveMetaData(object sender, RoutedEventArgs e)
        {
            try
            {
                //Compare and save
                if (enabledCheckBox.IsChecked != script.enabled)
                {
                    script.enabled = enabledCheckBox.IsChecked ?? false;
                }
                if (commandInput.Text != script.scriptCommand)
                {
                    script.scriptCommand = commandInput.Text;
                }
                if (scriptInput.Text != script.scriptName)
                {
                    script.scriptName = scriptInput.Text;
                }
                if (timeOutInput.Text != script.timeOut.ToString())
                {
                    script.timeOut = Int32.Parse(timeOutInput.Text);
                }
                if (FollowerOnlyCheckBox.IsChecked != script.enabled)
                {
                    script.followerOnly = FollowerOnlyCheckBox.IsChecked ?? false;
                }

                if (SubscriberOnlyCheckBox.IsChecked != script.enabled)
                {
                    script.subscriberOnly = SubscriberOnlyCheckBox.IsChecked ?? false;
                }
                if (modOnlyCheckBox.IsChecked != script.enabled)
                {
                    script.modOnly = modOnlyCheckBox.IsChecked ?? false;
                }
                //Save with this function

            } catch 
            {
                MessageBox.Show("Something went wrong");
                this.Hide();
            }
            scriptsHandler.SaveMetadata(script);
            this.Hide();

        }

        public void CancelButton(object sender, RoutedEventArgs e)
        {
            this.Hide();
        }

        private void timeOutInput_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (System.Text.RegularExpressions.Regex.IsMatch(timeOutInput.Text, "  ^ [0-9]"))
            {
                timeOutInput.Text = "";
            }
        }
    }
}
