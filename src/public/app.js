var intervalo;
var i=0, j=0;
var topicc, sensorn;
const Arry=[];
const Arrx=['', '','','','','','','','',''];

$(async function(){
        $('#btn-refresh').on('change',function(){
        var mode= $(this).prop('checked');
       if(mode){
            fajax();
            intervalo =setInterval(fajax, 3000);

        }
        else{
            clearInterval(intervalo);
            let graf=  document.getElementById('graf').style.display="none"
        }
    })

})
function fajax(){
    date = new Date()
    $.ajax({
        url: '../iot/all-ajax',
        success: function (sensors){
            let tbody = $('tbody');
            let graf=  document.getElementById('graf').style.display="block"
            let tabla= document.getElementById('tbody')
            sensors.forEach(sensor => {
                topicc=sensor.topic;
                sensorn=sensor.name;
                if(i==0){
                    tbody.html('');

                }
               
                if(i<10){
                    Arry[i]=sensor.value;
                    Arrx[i]=date.getHours()+ ":"+date.getMinutes()+ ":"+date.getSeconds();
                    console.log(date.getHours())
                    i=i+1;
                }
                else{                   
                    Arry[10]=sensor.value;
                    Arrx[10]=date.getHours()+ ":"+date.getMinutes()+ ":"+date.getSeconds();
                    Arry.shift();
                    Arrx.shift();  
                    tabla.removeChild(tabla.firstElementChild);
                }
                cha(sensors);
                
                tbody.append(`
                <tr id='trr'>
                    <th scope="row">${sensor.id}</th>  
                    <td scope="row">${sensor.name}</td>
                    <td>${sensor.status}</td><td>${sensor.value}</td>
                    <td>${sensor.topic}</td><td>${sensor.description}</td>
                    <td scope="row">${sensor.date}</td>
                </tr>
                `)
            });
            console.log(sensors);
        }
    })
}
function cha(sensors){
    /* chart.js chart examples */
    // chart colors
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];

    /* large line chart */
    var chLine = document.getElementById("chLine");
    var chartData;
    console.log(Arry)
    console.log(Arrx) 
    chartData = {
        labels: [Arrx[0],Arrx[1],Arrx[2],Arrx[3],Arrx[4],Arrx[5],Arrx[6],Arrx[7],Arrx[8],Arrx[9]],
        datasets: [{
            data: [Arry[0],Arry[1],Arry[2],Arry[3],Arry[4],Arry[5],Arry[6],Arry[7],Arry[8],Arry[9]],
            backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
        }]
        };


    if (chLine) {new Chart(chLine, {
        type: 'line',
        
        data: chartData,
        options: {
            animation: {
                duration: 0
            },
            title: {
                display: true,
                text: topicc+"/"+sensorn+" ("+ date.getDate()+"/"+date.getMonth()+1+"/"+date.getFullYear()+")"
            },
            scales: {
                xAxes: [
                    {
                        position: "botton",
                        scaleLabel: {
                            display: true,
                            labelString: "Hora",
                            fontFamily: "Montserrat",
                            fontColor: "black",
                        },
                        ticks: {
                            fontFamily: "Montserrat",
                            beginAtZero: true
                        }
                    }
                ],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Valor",
                    fontFamily: "Montserrat",
                    fontColor: "black",
                },
                ticks: {
                beginAtZero: true
                }
            }]
            },
            legend: {
            display: false
            }
        }
        });
    }

}