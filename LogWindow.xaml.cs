using System;
using System.Collections.Generic;
using System.ComponentModel;
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
    /// Interaction logic for LogWindow.xaml
    /// </summary>
    public partial class LogWindow : Window
    {
        public static RichTextBox twitchLog;
        public static Paragraph twitchLogs;
        public static FlowDocument twitchFlow;

        public static bool active = false;
        public LogWindow()
        {
            InitializeComponent();
            twitchLog = _twitchLogsRich;
            twitchLogs = new Paragraph();
            twitchFlow = new FlowDocument();
            active = true;

        }

        private void Window_Closing(object sender, CancelEventArgs e)
        {
            this.Visibility = Visibility.Hidden;
            e.Cancel = true;
        }

    }
}
