using System;
using System.Collections.Generic;
using System.Timers;
using SignalR.Hubs;

namespace MVCLiveChart.Hubs
{
    public class StockExchange : Hub
    {
        private Timer _timer;

        private double _fowlerPrice = 10.2;

        private double VaryPrice()
        {
            Random rnd = new Random();
            _fowlerPrice = _fowlerPrice + (rnd.Next(-1, 2) * rnd.NextDouble());
            return _fowlerPrice;
        }

        public bool Connect()
        {
            // Set unique id for client.
            Caller.Id = Context.ClientId;

            _timer = new Timer { Interval = 1000 };

            _timer.Elapsed += (sender, e) => Send(
                new List<SharePrice>(new[]
                                         {
                                             new SharePrice
                                                 {
                                                     Date = DateTime.Now,
                                                     Price = VaryPrice(),
                                                     Share = new Share {Name = "Fowler-Corp"}
                                                 }
                                         }));
            _timer.Start();

            return true;
        }

        public void Send(IEnumerable<SharePrice> sp)
        {
            Clients.drawShareValue(Context.ClientId, sp);
        }
    }

    public class Share
    {
        public string Name { get; set; }
    }

    public class SharePrice
    {
        public Share Share { get; set; }
        public DateTime Date { get; set; }
        public double Price { get; set; }
    }


}