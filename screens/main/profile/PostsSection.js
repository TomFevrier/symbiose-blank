import React from 'react';

import Feed from '../../../components/Feed';

const PostsSection = ({ uid }) => (
	<Feed uid={uid} showReposts />
);

export default PostsSection;
