export interface IPreview {
	expires?: number;
	expires_only?: boolean;
	sections: ISection[];
}

export interface ISection {
	title?: string;
	position?: number;
	title_display_mode?: string;
	subtitle_display_mode?: string;
	tiles: ISectionTile[];
}

export interface ISectionTile {
	title?: string;
	subtitle?: string;
	image_url: string;
	image_ratio: string;
	action_data: string;
	is_playable: boolean;
	display_from?: number;
	display_until?: number;
	position?: number;
}
