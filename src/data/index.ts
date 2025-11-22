/**
 * 角色数据对象
 */
export interface ICharacter {
	/** 姓名 */
	name: string;
	/** 出处 */
	from: string;
	/** 生日 */
	birthday: {
		day: number;
		month: number;
	};
	/** 额外文本 */
	text: string | undefined;
	/** 萌娘百科 URI */
	wiki: string | undefined;
	/** 公式 URI */
	official: string | undefined;
	/** 展示素材 */
	assets: {
		/** 头像 URI */
		avatar: string;
		/** 背景音乐 */
		bgm: string | undefined;
	};
}
