function changeSlideToText(){
    document.getElementById('numrect').value = document.getElementById('slider').value
  }
  function draw(){
    CHART = document.getElementById('myChart0')
    try{
      const expression = document.getElementById('eq').value
      const expr = math.compile(expression)
      const step = 0.25
      var lb = document.getElementById('lowerbound').value
      var ub = document.getElementById('upperbound').value
      ub = parseInt(ub) + step
      lb = parseInt(lb)
      const xValues = math.range(lb,ub,step).toArray()
      const yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
      });
      var yMax = yValues.reduce(function(a,b){
        return Math.max(a,b);
      });
      var yMin = yValues.reduce(function(a,b){
        return Math.min(a,b);
      });
      var xMax = xValues.reduce(function(a,b){
        return Math.max(a,b);
      });
      var xMin = xValues.reduce(function(a,b){
        return Math.min(a,b);
      });

      if(yMin > 0) yMin = 0;

      const trace1 = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        line: {shape: 'spline', smoothing: 1.3}
      }
      const data = [trace1]
      var layout = moreRects(lb,ub-step,xMin,xMax,yMin,yMax,expr)
      Plotly.newPlot(CHART,data,layout)
    }
    catch (err) {
      console.error(err)
      alert(err)
    }
  }
  function moreRects(lb,ub,xMin,xMax,yMin,yMax,expr) {
    var n = document.getElementById('numrect').value;
    var thisObject = {};
    thisObject.shapes = [];
    for(i = 0; i < n; i++){
      let scope = {x: (ub-lb)/n * i + (ub-lb)/n + lb}
      thisObject.shapes.push({
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: (ub-lb)/n * i + lb,
        y0: 0,
        x1: (ub-lb)/n * i + (ub-lb)/n + lb,
        y1: expr.evaluate(scope),
        fillcolor: 'green',
        opacity: 0.5,
        line: {width: 0}
      });
    }
    thisObject.xaxis = {range: [xMin-2,xMax+2]}
    thisObject.yaxis = {range: [yMin-2,yMax+2]}
    return thisObject;
  }
  document.getElementById('form').onsubmit = function (event){
    event.preventDefault()
    draw()
  }
  draw()
