import React, { Component } from "react";
import map from "lodash/map";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../../actions";

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchBlogs();
  }

  onDelete(event) {
    console.log("on delete event id", event.target.id);
    event.preventDefault();

    const { deleteBlog } = this.props;
    deleteBlog(event.target.id);
  }

  renderBlogs() {
    return map(this.props.blogs, blog => {
      return (
        <div className="card darken-1 horizontal" key={blog._id}>
          <div className="card-stacked">
            <div className="card-content">
              <span className="card-title">{blog.title}</span>
              <p>{blog.content}</p>
            </div>
            <div className="card-action">
              <Link to={`/blogs/${blog._id}`}>Read</Link>
              <button id={blog._id} onClick={this.onDelete.bind(this)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderBlogs()}</div>;
  }
}

function mapStateToProps({ blogs }) {
  return { blogs };
}

export default connect(
  mapStateToProps,
  { fetchBlogs, deleteBlog }
)(BlogList);
