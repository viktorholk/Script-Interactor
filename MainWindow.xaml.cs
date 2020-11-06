using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using TwitchLib.Client;
using TwitchLib.Client.Enums;
using TwitchLib.Client.Events;
using TwitchLib.Client.Extensions;
using TwitchLib.Client.Models;
using Microsoft.Win32;
using System.Windows.Threading;
using TwitchLib.Communication.Events;

namespace Script_Interactor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        //Handlers
        readonly ConfigHandler configHandler;
        readonly ScriptsHandler scriptsHandler;

        private static Config config;


        public static bool active = false;

        public List<Script> scripts;

        //Windows
        private readonly Login login;
        private readonly LogWindow logWindow;

        public MainWindow()
        {
            InitializeComponent();

            //Windows
            login = new Login();
            logWindow = new LogWindow();
            //Handlers
            configHandler = new ConfigHandler();
            scriptsHandler = new ScriptsHandler();
            //Chat log

            config = configHandler.get();
            //Connect to the bot
            Bot bot = new Bot(this,login,config, chatLog);
            try
            {
                bot.connect();
                active = true;
            }
            catch
            {
                MessageBox.Show("Could not connect");
            }



            //Change labels from config
            botNameLabel.Content = config.username;
            botChannelLabel.Content = config.channel;
            if (active)
            {
                statusLabel.Content = "Active";
            }
            else statusLabel.Content = "Idle";

            //Load scripts
            RefreshList();
            //Handle the user input and connect the bot
            //Bot bot = new Bot(Options.bot_Username, Options.bot_OAuth, Options.bot_channel);
        }

        private void RefreshList()
        {
            scriptsList.Items.Clear();
            foreach (var item in scriptsHandler.get())
            {
                scriptsList.Items.Add(item);
            }
        }



        void MainClosing(object sender, CancelEventArgs e)
        {
            Environment.Exit(0);
        }



        class Bot
        {
            TwitchClient client;
            ConnectionCredentials credentials;

            private string channel;

            Config config;

            private Paragraph chatLogs;
            private FlowDocument chatFlow;
            private RichTextBox chatLog;

            private MainWindow main;
            private Login login;

            public Bot(MainWindow _main,Login _login ,Config _config, RichTextBox _chatlog)
            {
                config = _config;
                chatLogs = new Paragraph();
                chatFlow = new FlowDocument();
                chatLog = _chatlog;

                main = _main;
                login = _login;

            }

            private void Client_OnLog(object sender, OnLogArgs e)
            {
                WriteTwitchLog(e.Data);
                if (e.Data.Contains("authentication failed"))
                {
                    client.Disconnect();
                    main.Hide();
                    login.Show();
                    MessageBox.Show("Authentication Error");
                }
            }

            private void Client_OnMessageReceived(object sender, OnMessageReceivedArgs e)
            {
                WriteChatLog(e.ChatMessage.DisplayName, e.ChatMessage.Message);
            }

            public void connect()
            {
                try
                {
                    credentials = new ConnectionCredentials(config.username, config.OAuth);
                    client = new TwitchClient();
                    client.Initialize(credentials, config.channel);

                    client.OnLog += Client_OnLog;
                    client.OnMessageReceived += Client_OnMessageReceived;

                    client.Connect();
                }
                catch (Exception e)
                {
                    MessageBox.Show(e.ToString());
                }
            }


            private void WriteChatLog(string username, string message)
            {

                chatLog.Dispatcher.Invoke(() =>
                {
                    Bold user = new Bold(new Run($"{username} "));
                    Run command = new Run($"{message}\n");
                    var time = DateTime.Now.ToString("HH:mm ");

                    chatLogs.Inlines.Add(time);
                    chatLogs.Inlines.Add(user);
                    chatLogs.Inlines.Add(command);
                    chatFlow.Blocks.Add(chatLogs);

                    chatLog.Document = chatFlow;
                    chatLog.ScrollToEnd();
                });

            }

            private void WriteTwitchLog(string log)
            {
                LogWindow.twitchLog.Dispatcher.Invoke(() =>
                {
                    var time = DateTime.Now.ToString("HH:mm ");
                    LogWindow.twitchLogs.Inlines.Add(new Bold(new Run(time + " ")));
                    LogWindow.twitchLogs.Inlines.Add(log + "\n");
                    LogWindow.twitchFlow.Blocks.Add(LogWindow.twitchLogs);

                    LogWindow.twitchLog.Document = LogWindow.twitchFlow;
                    
                });
            }

        }

        private void Edit_Click(object sender, RoutedEventArgs e)
        {
            this.Hide();
            login.Show();

        }

        private void Log_Click(object sender, RoutedEventArgs e)
        {
            if (!LogWindow.active)
            {
                logWindow.Show();
            }
            else
            {
                logWindow.Visibility = Visibility.Visible;
                LogWindow.twitchLog.ScrollToEnd();
            }
        }

        private void AddScript_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog openFile = new OpenFileDialog();
            openFile.Multiselect = true;
            if(openFile.ShowDialog() == true)
            {
                var scriptFolder = "scripts";
                if (!Directory.Exists(scriptFolder))
                {
                    Directory.CreateDirectory(scriptFolder);
                }

                foreach (var file in openFile.FileNames)
                {
                    File.Copy(file, System.IO.Path.Combine(scriptFolder, System.IO.Path.GetFileName(file)));
                }

            }
            RefreshList();
        }

        private void EditScript_Click(object sender, RoutedEventArgs e)
        {
            if(scriptsList.SelectedItem != null)
            {
                var metaData = scriptsList.SelectedItem as Script;
                MetaData editWindow = new MetaData(metaData);
                editWindow.Show();
            }
        }


    }
}
