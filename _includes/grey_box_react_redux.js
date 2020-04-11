var svg = d3.select("svg#fullFlow"),
  width = +svg.attr("width"),
  height = +svg.attr("height")

var maxVertical = 5,
  maxHorizontal = 10;

var verticalBufferDistance = height / (2 * maxVertical),
  horizontalBufferDistance = width / (1 + maxHorizontal),
  circleRadius = Math.min(verticalBufferDistance, horizontalBufferDistance) / 2

function buildGraphNodes(maxVertical, maxHorizontal) {
  var graph = {
    "nodes": [],
    "links": []
  };

  for (let horizontalIndex = 0; horizontalIndex < maxHorizontal; horizontalIndex++) {
    let verticalCount = horizontalIndex % 2 == 0 ? (maxVertical - 1) : maxVertical;
    for (let verticalIndex = 0; verticalIndex < verticalCount; verticalIndex++) {
      let sourceNodeIndex = graph.nodes.length;
      let node = {
        "x": (horizontalIndex + 1) * horizontalBufferDistance,
        "y": ((verticalIndex * 2) + (verticalCount == maxVertical ? 1 : 2)) * verticalBufferDistance,
        "parents": [],
        "index": sourceNodeIndex
      }
      if (horizontalIndex == 0) {
        graph.nodes.push(node);
        continue;
      }
      if (verticalIndex != 0 || verticalCount != maxVertical) {
        node.parents.push(graph.nodes[sourceNodeIndex - (maxVertical)]);
      }
      if (verticalIndex != maxVertical - 1) {
        node.parents.push(graph.nodes[sourceNodeIndex - (maxVertical - 1)]);
      }
      for (const parent of node.parents) {
        graph.links.push({
          "source": parent,
          "target": node,
          "targetIndex": sourceNodeIndex
        })
      }
      graph.nodes.push(node);
    }
  }
  return graph;
}

var graph = buildGraphNodes(maxVertical, maxHorizontal);

function buildCircles(targetSvg) {
  for (let i = 0; i < graph.nodes.length; i++) {
    circle = graph.nodes[i]
    targetSvg.append("circle")
      .attr("cx", circle.x)
      .attr("cy", circle.y)
      .attr("r", circleRadius)
      .attr("data-index", i);
  }
}

buildCircles(svg);
var isoSvg = d3.select("#isolated");
buildCircles(isoSvg);
var solSvg = d3.select("#solution");
buildCircles(solSvg);
var flowSvg = d3.select("#allFlowTests");
buildCircles(flowSvg);
var endFlowSvg = d3.select("#endFlowTests");
buildCircles(endFlowSvg);

circleAIndex = 20
circleBIndex = 24
isoSvg.selectAll("circle:nth-of-type(" + (circleAIndex + 1) + "), circle:nth-of-type(" + (circleBIndex + 1) + ")")
  .attr("class", "permawhite");

var circleA = graph.nodes[circleAIndex];
var circleB = graph.nodes[circleBIndex];

var isoGraph = {
  "nodes": [{
    "x": circleA.x,
    "y": circleA.y,
    "parents": [],
    "index": circleAIndex
  }]
};
isoGraph.nodes.push({
  "x": circleB.x,
  "y": circleB.y,
  "parents": [isoGraph.nodes[0]],
  "index": circleBIndex
});

var solutionSuiteCount = 0;
var flowSuiteCount = 0;


function generateRandomParentChain(endCircle) {
  var parentChain = [endCircle];
  var randomParentCircle = endCircle;
  while (randomParentCircle.parents.length > 0) {
    randomParentCircle = randomParentCircle.parents[Math.floor(Math.random() * randomParentCircle.parents.length)];
    parentChain.push(randomParentCircle);
  }
  return parentChain;
}

function generatePathFromParentChain(parentChain) {
  var parentChainCopy = parentChain.slice();
  var parentCircle = parentChainCopy.pop();
  var path = d3.path();
  path.moveTo(parentCircle.x, parentCircle.y);
  while (parentChainCopy.length > 0) {
    parentCircle = parentChainCopy.pop();
    path.lineTo(parentCircle.x, parentCircle.y);
  }
  return path;
}

svg.selectAll("circle")
  .on("mouseover", function() {
    d3.select(this).attr("data-hover", true);
  })
  .on("mouseout", function() {
    d3.select(this).attr("data-hover", null);
  });

function draw(targetSvg, targetGraph, previousParentChain) {
  var endCircleIndex = 0,
    endCircle = targetGraph.nodes[endCircleIndex];
  hoverEndCircle = targetSvg.select("[data-hover='true']")
  do {
    if (hoverEndCircle.empty()) {
      endCircle = targetGraph.nodes[Math.floor(Math.random() * (targetGraph.nodes.length))];
      endCircleIndex = endCircle.index;
    } else {
      endCircleIndex = hoverEndCircle.attr("data-index");
      endCircle = targetGraph.nodes.find(element => element.index == endCircleIndex);
      break;
    }
  } while (endCircle.parents.length == 0);
  var newRandomParentChain;
  if (previousParentChain) {
    let previousEndCircle = previousParentChain[0]
    if (JSON.stringify(previousEndCircle) == JSON.stringify(endCircle)) {
      if (endCircle.parents.length < 2) {
        newRandomParentChain = previousParentChain;
      }
    }
  }
  if (!newRandomParentChain) {
    do {
      newRandomParentChain = generateRandomParentChain(endCircle);
    } while ((previousParentChain && JSON.stringify(newRandomParentChain) == JSON.stringify(previousParentChain)) && endCircle.parents.length > 1);
  }
  var newPath = generatePathFromParentChain(newRandomParentChain);

  var flow = targetSvg.select(".flow"),
    arrow = targetSvg.select(".arrow"),
    path = flow.node(),
    totalLength = path.getTotalLength();
  var previousEndCircleIndex;
  if (previousParentChain) {
    previousEndCircleIndex = targetGraph.nodes.indexOf(previousParentChain[previousParentChain.length - 1]);
  }
  var duration = (newPath.toString().split("L").length - 1) * 250;
  var callback = () => {
    draw(targetSvg, targetGraph, newRandomParentChain)
  };
  let circle = targetSvg.select("circle:nth-of-type(" + (endCircleIndex + 1) + ")");
  transitionLineToCircle(targetSvg, circle, flow, newPath, arrow, duration, callback, 1000);
}

function transitionLineToCircle(targetSvg, endCircle, flow, path, arrow, duration, callback, delay) {

  var flowPath = flow.node();
  var totalLength;
  var t = targetSvg.transition()
    .duration(duration)
    .delay(delay)
    .on("start", function() {
      targetSvg.selectAll("*:not(#isolated) circle[style]").style("fill", null);
      targetSvg.selectAll("[data-test-target]")
        .attr("data-test-target", null);
      endCircle.attr("data-test-target", true);
      flow.style("display", "none");
      flow.attr("d", path);
      totalLength = flowPath.getTotalLength();
      arrow.style("display", "block");
      flow.style("display", "block");
    })
    .on("end", () => {
      callback()
    });

  arrow.transition(t)
    .attrTween("transform", function() {
      return function(t) {
        var pos = t * totalLength;
        return "translate(" + pointAtLength(flowPath, pos) + ") rotate( " + angleAtLength(flowPath, pos) + ")";
      };
    });

  flow.transition(t)
    .attrTween("stroke-dasharray", function() {
      return d3.interpolateString("0," + totalLength, totalLength + "," + totalLength);
    });
}

function drawSolution(targetSvg, targetGraph) {
  var duration = 250
  var randomIndex = Math.floor(Math.random() * targetGraph.links.length);
  var testMetaphor = targetGraph.links.splice(randomIndex, 1)[0];
  d3.select("#solutionTestCount text.label").text("Tests Completed: " + (graph.links.length - targetGraph.links.length) + "/" + graph.links.length);
  d3.select("#solutionSuiteCount text.label").text("Suite Runs Completed: " + solutionSuiteCount);
  var newPath = d3.path();
  newPath.moveTo(testMetaphor.source.x, testMetaphor.source.y);
  newPath.lineTo(testMetaphor.target.x, testMetaphor.target.y);

  var flow = targetSvg.select(".flow"),
    arrow = targetSvg.select(".arrow");
  var circle = targetSvg.select("circle:nth-of-type(" + (testMetaphor.targetIndex + 1) + ")")
  var result = Math.random() * 100 >= 90 ? "fail" : "pass";
  var callback = () => {
    targetSvg.selectAll("[data-test-target]").attr("data-test-target", null);
    targetSvg.select("#links").append("path")
      .attr("data-result", result)
      .attr("d", newPath);
    flow.style("display", "none");
    if (circle.attr("data-result") != "fail") {
      circle.attr("data-result", result);
    }
    if (targetGraph.links.length == 0) {
      solutionSuiteCount++;
      targetSvg.transition()
        .delay(2000)
        .on("end", () => {
          flow.style("display", "none");
          targetSvg.selectAll("circle")
            .attr("data-result", null)
            .style("fill", null);
          targetSvg.selectAll("path[data-result]").remove();
          var newTargetGraph = {
            "nodes": graph.nodes.slice(),
            "links": graph.links.slice()
          };
          targetSvg.transition()
            .delay(1000)
            .on("end", () => {
              drawSolution(targetSvg, newTargetGraph)
            });
        });
      return;
    }
    drawSolution(targetSvg, targetGraph);
  };
  transitionLineToCircle(targetSvg, circle, flow, newPath, arrow, 250, callback, 100);
}


function pointAtLength(path, l) {
  var xy = path.getPointAtLength(l);
  return [xy.x, xy.y];
}

// Approximate tangent
function angleAtLength(path, l) {
  var a = pointAtLength(path, Math.max(l - 0.01, 0)), // this could be slightly negative
    b = pointAtLength(path, l + 0.01); // browsers cap at total length
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
}

function getAllFlowChainPermutations(targetGraph) {
  var nodeCopies = targetGraph.nodes.slice()
  targetGraph.allChains = [];
  for (const node of targetGraph.nodes) {
    getFlowChainPermutationsForNode(node);
    targetGraph.allChains.push(...node.flowChains);
  }
  targetGraph.totalFlows = targetGraph.allChains.Length;
}

function getFlowChainPermutationsForNode(node) {
  node.flowChains = [];
  var allParentChains = []
  for (const parent of node.parents) {
    if (parent.flowChains.length == 0) {
      node.flowChains.push([node, parent]);
      continue;
    }
    allParentChains.push(...parent.flowChains);
  }
  for (const chain of allParentChains) {
    node.flowChains.push([node, ...chain]);
  }
}

function generateTestResults(targetGraph) {
  for (const node of targetGraph.nodes) {
    node.result = Math.random() * 100 >= 90 ? "fail" : "pass";
  }
}

function drawFullFlowTests(targetSvg, targetGraph, testCaseText, testSuiteText) {
  /* For a given test scenario, i.e. flow, if a step it is dependent on is broken, then the test being run will be shown as a failure until it is tested again through a non-broken flow. */
  var duration = 250
  var randomIndex = Math.floor(Math.random() * targetGraph.tempAllChains.length);
  var testMetaphor = targetGraph.tempAllChains.splice(randomIndex, 1)[0];
  testCaseText.text("Tests Completed: " + (targetGraph.allChains.length - targetGraph.tempAllChains.length) + "/" + targetGraph.allChains.length);
  testSuiteText.text("Suite Runs Completed: " + flowSuiteCount);
  var newPath = generatePathFromParentChain(testMetaphor);

  var flow = targetSvg.select(".flow"),
    arrow = targetSvg.select(".arrow");
  var endCircleIndex = testMetaphor[0].index;
  let circle = targetSvg.select("circle:nth-of-type(" + (endCircleIndex + 1) + ")")
  var result = testMetaphor.reduce((result, node) => {
    return result && node.result == "pass"
  }) ? "pass" : "fail";
  var callback = () => {
    targetSvg.selectAll("[data-test-target]").attr("data-test-target", null);
    targetSvg.select("#flows").append("path")
      .attr("data-result", result)
      .attr("d", newPath);
    flow.style("display", "none");
    circle.attr("data-result", result);
    if (targetGraph.tempAllChains.length == 0) {
      flowSuiteCount++;
      targetSvg.transition()
        .delay(2000)
        .on("end", () => {
          flow.style("display", "none");
          targetSvg.selectAll("circle")
            .attr("data-result", null)
            .style("fill", null);
          targetSvg.selectAll("path[data-result]").remove();
          targetGraph.tempAllChains = targetGraph.allChains.slice();
          generateTestResults(targetGraph);
          targetSvg.transition()
            .delay(1000)
            .on("end", () => {
              targetSvg.selectAll("[data-test-target]").attr("data-test-target", null);
              drawFullFlowTests(targetSvg, targetGraph)
            });
        });
      return;
    }
    drawFullFlowTests(targetSvg, targetGraph, testCaseText, testSuiteText);
  };
  transitionLineToCircle(targetSvg, circle, flow, newPath, arrow, (newPath.toString().split("L").length - 1) * 250, callback, 100);
}
draw(svg, graph)
draw(isoSvg, isoGraph)
var graphCopy = {
  "nodes": graph.nodes.slice(),
  "links": graph.links.slice()
}
drawSolution(solSvg, graphCopy)


var allFlowTestCaseText = d3.select("#allFlowTestCount text");
var allFlowTestSuiteText = d3.select("#allFlowSuiteCount text")
var graphFlowCopy = buildGraphNodes(maxVertical, maxHorizontal);
getAllFlowChainPermutations(graphFlowCopy);
graphFlowCopy.tempAllChains = graphFlowCopy.allChains.slice();
generateTestResults(graphFlowCopy);
drawFullFlowTests(flowSvg, graphFlowCopy, allFlowTestCaseText, allFlowTestSuiteText);


var endFlowTestCaseText = d3.select("#endFlowTestCount text");
var endFlowTestSuiteText = d3.select("#endFlowSuiteCount text")
var graphEndFlowCopy = buildGraphNodes(maxVertical, maxHorizontal);
getAllFlowChainPermutations(graphEndFlowCopy);
graphEndFlowCopy.allChains = graphEndFlowCopy.allChains.filter((chain) => {
  return chain[0].index >= graphEndFlowCopy.nodes.length - 5
})
graphEndFlowCopy.tempAllChains = graphEndFlowCopy.allChains.slice();
generateTestResults(graphEndFlowCopy);
drawFullFlowTests(endFlowSvg, graphEndFlowCopy, endFlowTestCaseText, endFlowTestSuiteText);
