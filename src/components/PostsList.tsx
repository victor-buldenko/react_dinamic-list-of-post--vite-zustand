import React from 'react';
import { Store } from '../store';
import cn from 'classnames';
import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';

export const PostsList: React.FC = () => {
  const {
    posts,
    showSidebar,
    setSelectedPost,
    setShowSidebar,
    setPostComments,
    setPostCommentsLoading,
    setPostCommentsError,
  } = Store();

  const postButtonHandler = (post: Post) => {
    setPostCommentsLoading(true);
    if (showSidebar === post.id) {
      setShowSidebar(-1);
    } else {
      setSelectedPost(post);
      setShowSidebar(post.id);
      client
        .get(`/comments?postId=${post.id}`)
        .then((res) => {
          if (Array.isArray(res)) {
            setPostComments(res);     
          } else {
            throw res;
          }
        })
        .catch((res) => {
          setPostCommentsError(true);
          new Error(res);
        })
        .finally(() => {
          setPostCommentsLoading(false);
        });
    }
  };

  return (
    <div data-cy='PostsList'>
      <p className='title'>Posts:</p>

      <table className='table is-fullwidth is-striped is-hoverable is-narrow'>
        <thead>
          <tr className='has-background-link-light'>
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts?.map((post) => (
            <tr data-cy='Post' key={post.id}>
              <td data-cy='PostId'>{post.id}</td>

              <td data-cy='PostTitle'>{post.title}</td>

              <td className='has-text-right is-vcentered'>
                <button
                  type='button'
                  data-cy='PostButton'
                  className={cn('button is-link', {
                    'is-light': showSidebar !== post.id,
                  })}
                  onClick={() => postButtonHandler(post)}
                >
                  {showSidebar === post.id ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
