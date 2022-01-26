import React from 'react';

import Image from '../Common/Image/Image';

const UserCard = ({ data }) => {
	return (
		<div className="p-4 border border-gray-500 rounded bg-white flex items-center">
			<div>
				<Image
					src={data.picture?.medium}
					styles="w-16 h-16 rounded-full border-2 border-green-600"
					width="72"
					height="72"
					alt="user"
					lazy="lazy"
				/>
			</div>
			<div className="ml-3">
				<p className="text-base font-bold">
					{data.name?.first} {data.name?.last}
				</p>
				<p className="text-sm text-gray-800">
					{data.location?.city}, {data.location?.country}
				</p>
				<p className="text-sm text-gray-500 break-all">{data.email}</p>
			</div>
		</div>
	);
};

export default UserCard;
