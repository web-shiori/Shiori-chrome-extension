interface Content {
    content_id: number;
    type: string;
    title: string;
    url: string;
    sharing_url: string;
    file_url: string;
    thumbnail_img_url: string;
    scroll_position_x: number;
    scroll_position_y: number;
    max_scroll_position_x: number;
    max_scroll_position_y: number;
    video_playback_position: number;
    specified_text: string;
    specified_dom_id: string;
    specified_dom_class: string;
    specified_dom_tag: string;
    liked: boolean;
    delete_flag: boolean;
    deleted_at: string;
    created_at: string;
    updated_at: string;
}

interface PostContent {
    title: string;
    url: string;
    scroll_position_x: number;
    scroll_position_y: number;
    max_scroll_position_x: number;
    max_scroll_position_y: number;
    video_playback_position: number;
    specified_text: string|null;
    specified_dom_id: string|null;
    specified_dom_class: string|null;
    specified_dom_tag: string|null;
}
