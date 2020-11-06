using System;
using System.IO;
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
using Newtonsoft.Json;
using System.ComponentModel;

namespace Script_Interactor
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class Login : Window
    {
        string a = "oauth:v60lxyqthw5oghfgl9uv6hc2807erg";
        private ConfigHandler handler;
        public Login()
        {
            InitializeComponent();
            handler = new ConfigHandler();
            if (handler.get() != null)
            {
                botUsernameInput.Text = handler.get().username;
                botOAuthInput.Password = handler.get().OAuth;
                channelInput.Text = handler.get().channel;
            }

        }

        void Connect(object sender, RoutedEventArgs e)
        {
            handler.SaveConfig(new Config()
            {
                username = botUsernameInput.Text,
                OAuth = botOAuthInput.Password,
                channel = channelInput.Text

            });
            MainWindow window = new MainWindow();
            window.Show();
            this.Hide();

        }

        void LoginClosing(object sender, CancelEventArgs e)
        {
            Environment.Exit(0);
        }
    }
}
