using System;
using System.Collections.Generic;
using System.Text;

namespace Script_Interactor
{
    public class Script
    {
        public bool enabled = false;
        public string scriptCommand = "";
        public string scriptName { get; set; }
        public string metaDataName { get; set; }
        public int timeOut = 30;
        public int cost = 0;
        public bool followerOnly = true;
        public bool subscriberOnly = false;
        public bool modOnly = false;

        public string followerError = "You have to be a follower to use this command ";
        public string subscriberError = "You have to be a subscriber to use this command ";
        public string modError = "You have to be a mod to use this command ";

}
}
