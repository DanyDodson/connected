import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import posts from '../components/posts/posts-reducer'

export default combineReducers({
  alert,
  posts,
  auth,
  profile,
  post,
});
