const MP4 = ['mp4', 'm4a', 'm4v', 'mpg4'];
const AVI = ['avi'];
const MOV = ['mov', 'qt'];
const WMV = ['wmv'];
const MKV = ['mkv'];
const FLV = ['flv'];
const WebM = ['webm'];
const MPEG2 = ['mpg', 'mpeg', 'm2v'];
const MPEG1 = ['mpg', 'mpeg', 'm1v'];
const GP3 = ['3gp', '3g2'];

export const supportedFileType = [
	MP4,
	AVI,
	MOV,
	WMV,
	MKV,
	FLV,
	WebM,
	MPEG1,
	MPEG2,
	GP3,
].flat();
