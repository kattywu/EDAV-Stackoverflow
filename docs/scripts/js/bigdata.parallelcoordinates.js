var graph;
var dataset;
    
    d3.csv("https://raw.githubusercontent.com/kattywu/EDAV-Stackoverflow/main/scripts/data/df.csv", function(data) {
    dataset = data;
      graph = d3.parcoords()('#wrapper')
                .data(data)
                .alpha(0.3)
                .margin({ top: 24, left: 75, bottom: 12, right: 0 })
                .mode("queue")
                .rate(20)
                .render()
                .interactive()
                .brushable()
                .reorderable()
                
                
    //Set starting color to year
     change_color("Year");

      graph.svg
           .selectAll(".dimension")
           .on("click", change_color);


      var grid = d3.divgrid();
      d3.select("#grid")
          .datum(data.slice(0,10))
          .call(grid)
          .selectAll(".row")
          .on({
            "mouseover": function(d) { graph.highlight([d]) },
            "mouseout": graph.unhighlight
          });

      graph.on("brush", function(d){
        d3.select("#grid")
          .datum(d.slice(0,10))
          .call(grid)
          .selectAll(".row")
          .on({
            "mouseover": function(d) { graph.highlight([d])},
            "mouseout": graph.unhighlight
          });
      });
  });
  
       // Remove everything not selected
      d3.select("#keep-data")
        .on("click", function() {
          new_data = graph.brushed();
          if (new_data.length == 0) {
            alert("Please do not remove all the data");
            return false;
          }
          UpdateGraph(new_data);
        });
    
      // Remove selected from the dataset
      d3.select("#remove-data")
        .on("click", function() {
          new_data = _.difference(dataset, graph.brushed());
          if (new_data.length == 0) {
            alert("Please do not remove all the data");
            return false;
          }
          UpdateGraph(new_data);
        });
        
      // Start over
      d3.select("#reset-data")
         .on("click", function() {
               UpdateGraph(dataset);
         });
         
      

    var color_scale = d3.scale.linear()
                        .range(['#ddaa33', '#bb5566', '#004488'])
                        .interpolate(d3.interpolateLab);


    
    	function change_color(dimension) {
		// change the fonts to bold
		graph.svg.selectAll(".dimension")
				.style("font-weight", "normal")
				.filter(function(d) { return d == dimension; })
				.style("font-weight", "bold");
		//add ordinal scale for categorical variable
    if(dimension=="Tags"){
      color_scale = d3.scale.ordinal()
      .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
            "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
            "#cab2d6","#6a3d9a","#ffff99","#b15928"]);
    }else{
      color_scale = d3.scale.linear()
                        .range(['#ddaa33', '#bb5566', '#004488'])
                        .interpolate(d3.interpolateLab);
    }
		// set domain of color scale
		var values = graph.data().map(function(d){return parseFloat(d[dimension])});
		color_scale.domain([d3.min(values),d3.mean(values), d3.max(values)]);

		// change colors for each line
		graph.color(function(d){return color_scale([d[dimension]])}).render();
	};

    
    function UpdateGraph(data) {
             graph.data(data).brush().render().updateAxes();
             
    }
    
      