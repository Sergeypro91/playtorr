export const defineBucketPolicy = (bucketName: string) => {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Effect: 'Allow',
				Principal: {
					AWS: ['*'],
				},
				Action: [
					's3:ListBucketMultipartUploads',
					's3:GetBucketLocation',
					's3:ListBucket',
				],
				Resource: [`arn:aws:s3:::${bucketName}`],
			},
			{
				Effect: 'Allow',
				Principal: {
					AWS: ['*'],
				},
				Action: [
					's3:PutObject',
					's3:AbortMultipartUpload',
					's3:DeleteObject',
					's3:GetObject',
					's3:ListMultipartUploadParts',
				],
				Resource: [`arn:aws:s3:::${bucketName}/*`],
			},
		],
	};
};
