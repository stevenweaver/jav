import React, { Component } from "react";

const d3 = require("d3");
const $ = require("jquery");

class SiteAxis extends Component {
  initialize() {
    if (this.props.sequence_data) {
      const { width, height, site_size, start_site } = this.props;
      d3
        .select("#alignmentjs-axis-div")
        .style("width", width + "px")
        .style("height", height + "px");
      const { number_of_sites } = this.props.sequence_data,
        alignment_width = site_size * number_of_sites;

      var axis_scale = d3
        .scaleLinear()
        .domain([start_site + 1, start_site + number_of_sites])
        .range([site_size / 2, alignment_width - site_size / 2]);

      var axis_svg = d3.select("#alignmentjs-axis");
      axis_svg.html("");
      axis_svg.attr("width", alignment_width).attr("height", height);

      var axis = d3
        .axisTop()
        .scale(axis_scale)
        .tickValues(d3.range(start_site + 1, start_site + number_of_sites, 2));

      axis_svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height - 2})`)
        .call(axis);

      $("#alignmentjs-axis-div").scrollLeft(this.props.x_pixel);
    }
  }
  componentDidMount() {
    document
      .getElementById("alignmentjs-axis-div")
      .addEventListener("alignmentjs_wheel_event", function(e) {
        $("#alignmentjs-axis-div").scrollLeft(e.detail.x_pixel);
      });
    this.initialize();
  }
  componentDidUpdate() {
    this.initialize();
  }
  handleWheel(e) {
    e.preventDefault();
    this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
  }
  render() {
    return (
      <div
        id="alignmentjs-axis-div"
        style={{ overflowY: "scroll", overflowX: "hidden" }}
        onWheel={e => this.handleWheel(e)}
      >
        <svg
          id="alignmentjs-axis"
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

SiteAxis.defaultProps = {
  x_pixel: 0,
  site_size: 20,
  sender: "main",
  start_site: 0
};

export default SiteAxis;
