import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'

import PostItem from './thumbs'
import PostForm from './form'

import { getPosts } from './posts-actions'

const mapStateToProps = state => ({ post: state.post })

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts()
  }, [getPosts])

  return loading
    ? (<Spinner />)
    : (
      <Fragment>
        <h1 className='large text-primary'>Posts</h1>
        <p className='lead'>
          <i className='fas fa-user' />
          {'Welcome to the community'}
        </p>
        <PostForm />
        <div className='posts'>
          {posts.map(post => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </Fragment>
    );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { getPosts })(Posts)
