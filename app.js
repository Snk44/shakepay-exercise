
const app = Vue.createApp({
    async mounted () {
      const btcToCadRate = 75484.51
      let netWorthTotal = 0;
      let graphData = [];
      await fetch('https://shakepay.github.io/programming-exercise/web/transaction_history.json')
        .then(response => response.json())
        .then(function(response){
            response.forEach((element) => {
                // Parse to get total amount and cumulative total after each transaction

                if(element.type === 'conversion'){
                    // Not needed for total worth
                    return
                }
                let amount = element.amount;
                if(element.currency.toUpperCase() === "BTC"){
                    amount = element.amount * btcToCadRate;
                }
                if(element.direction.toLowerCase() === "debit" ){
                    amount = -amount
                }

                graphData.push({
                    date: element.createdAt,
                    cumulativeTotal: (netWorthTotal + amount).toFixed(2)
                });
                netWorthTotal += amount

            });

            // Group by date
            const groups = graphData.reduce((groups, trans) => {
              const date = trans.date.split('T')[0];
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(trans);
              return groups;
            }, {});

            let graphArr = Object.keys(groups).map((date) => {
              //Sort date by descending
              const sortedGroup = groups[date].sort(function(a,b){return new Date(b.date) - new Date(a.date);})

              // Get cumulative total of the last transaction during that day
              return {
                date,
                amount: sortedGroup[0].cumulativeTotal
              };
            });

            // Sort graph date by ascending
            this.graphArr = graphArr.sort(function(a,b){return new Date(a.date) - new Date(b.date);})
            console.log(this.graphArr)

            this.netWorthTotal = netWorthTotal
            console.log( this.netWorthTotal.toFixed(2))
          })
          .catch(error => {
            console.log(error)
        });
    },
    data() {

        return {
            netWorthTotal: this.netWorthTotal,
        }
        
    },
    methods: {

    },
  })
  
  app.mount('#app')
