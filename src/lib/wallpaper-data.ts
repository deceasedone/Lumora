import {
  Mountain,
  Building2,
  Rocket,
  Star,
  CloudRain,
  Coffee,
  Library,
  Snowflake,
  Flame,
  Shapes,
  type LucideIcon,
} from 'lucide-react';

export interface Wallpaper {
  id: string; // YouTube ID or Pixabay URL
  type: 'youtube' | 'pixabay';
  name: string;
}

export interface Category {
  name: string;
  icon: LucideIcon;
  wallpapers: Wallpaper[];
}

// Handpick your wallpapers here
export const wallpaperData: {
  mySelections: Wallpaper[];
  youtube: Category[];
  pixabay: Category[];
} = {
  mySelections: [
    { id: 'https://www.youtube.com/watch?v=hj83cwfOF3Y', type: 'youtube', name: 'Soul of Wind 1' },
    { id: 'https://www.youtube.com/watch?v=HSOtku1j600', type: 'youtube', name: 'Soul of Wind 2' },
    { id: 'https://www.youtube.com/watch?v=bP9gMpl1gyQ', type: 'youtube', name: 'Soul of Wind 3' },
    { id: 'https://www.youtube.com/watch?v=YQs7IVvvVYw', type: 'youtube', name: 'Raining in Osaka <3' },
    { id: 'https://www.youtube.com/watch?v=dLmyp3xMsAo', type: 'youtube', name: 'Late Night Nostalgia' },
    { id: 'https://www.youtube.com/watch?v=dvePJr9AUHA', type: 'youtube', name: '1hr Kudasai' },
    { id: 'https://www.youtube.com/watch?v=xMVaEnw5kpk', type: 'youtube', name: 'Best of Nujabes' },
    { id: 'https://www.youtube.com/watch?v=z3aS5AwhJSU', type: 'youtube', name: 'Nujabes playlist' },
    { id: 'https://www.youtube.com/watch?v=35AgDDPQE48', type: 'youtube', name: 'Best of Kudasai' },
    { id: 'https://www.youtube.com/watch?v=8sJk9AE82kc', type: 'youtube', name: '3h Piano' },
    { id: 'https://www.youtube.com/watch?v=levI42shC_c', type: 'youtube', name: 'Watame Lullaby' },
    { id: 'https://www.youtube.com/watch?v=NcauOz6DCeg', type: 'youtube', name: 'Shiloh (old sad lofi not recommended in general)' },    
  ],
  youtube: [
    {
      name: 'Lofi',
      icon: Star,
      wallpapers: [
        { id: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', type: 'youtube', name: '24/7 Lofi Girl' },
        { id: 'https://www.youtube.com/watch?v=7XXu_-eoxHo', type: 'youtube', name: 'Playlist 80s Tokyo Vibes'}, 
        { id: 'https://www.youtube.com/watch?v=StNqF4FaD9k', type: 'youtube', name: 'Playlist 80s Chillout Tokyo'}, 
        { id: 'https://www.youtube.com/watch?v=ArHSMbhjLiE', type: 'youtube', name: 'Playlist 80s Tokyo Hiphop'}, 
        { id: 'https://www.youtube.com/watch?v=AMcVJmb5mvk', type: 'youtube', name: 'Playlist 90s Japanese HipHop'}, 
        { id: 'https://www.youtube.com/watch?v=d2VdpHxmbPE', type: 'youtube', name: '90s Lofi City'}, 
        { id: 'https://www.youtube.com/watch?v=BrnDlRmW5hs', type: 'youtube', name: 'Old songs but it\'s lofi remix'}, 
        { id: 'https://www.youtube.com/watch?v=Y-_r24GOvjo', type: 'youtube', name: 'Old songs but it\'s lofi remix 2'},
         { id: 'https://www.youtube.com/watch?v=CLeZyIID9Bo', type: 'youtube', name: 'Chill Lofi Mix' },
         { id: 'https://www.youtube.com/watch?v=OO2kPK5-qno', type: 'youtube', name: 'Lofi Coffee' }, 
        { id: 'https://www.youtube.com/watch?v=6H-PLF2CR18', type: 'youtube', name: 'Lofi Deep Focus' },
         { id: 'https://www.youtube.com/watch?v=AEl5THIFfZo', type: 'youtube', name: 'inabakumori  Lofi 1' },
         { id: 'https://www.youtube.com/watch?v=4bzEgrvU1lA', type: 'youtube', name: 'inabakumori  Lofi 2' },
         { id: 'https://www.youtube.com/watch?v=h9yya-j_kjE', type: 'youtube', name: 'yorushika but it\'s lofi' }
        ,{ id: 'https://www.youtube.com/watch?v=lTRiuFIWV54', type: 'youtube', name: '1 A.M Study Session' },
         { id: 'https://www.youtube.com/watch?v=VUQfT3gNT3g', type: 'youtube', name: 'Lofi Room' }, 
         { id: 'https://www.youtube.com/watch?v=JdqL89ZZwFw', type: 'youtube', name: 'Lofi Summer' },
         { id: 'https://www.youtube.com/watch?v=-Egagbt9ZDk', type: 'youtube', name: 'Lofi Summer 2' },
         { id: 'https://www.youtube.com/watch?v=JbX3lblk0Ys', type: 'youtube', name: 'Lofi City' },
         { id: 'https://www.youtube.com/watch?v=TGan48YE9Us', type: 'youtube', name: 'morning walk' },
         { id: 'https://www.youtube.com/watch?v=DbuebKNKQsQ', type: 'youtube', name: 'a peaceful place' },
      ],
    },
    {
      name: 'Calm',
      icon: Mountain,
      wallpapers: [ 
{ id: 'https://www.youtube.com/watch?v=Zu_pBbCwovA', type: 'youtube', name: 'Beautiful Piano JP' },
{ id: 'https://www.youtube.com/watch?v=2ohqjRtqF7Y', type: 'youtube', name: 'Ocean Wave OST' }, 
{ id: 'https://www.youtube.com/watch?v=X2V0ag9mCjc', type: 'youtube', name: 'Calm your Heart' }, 
{ id: 'https://www.youtube.com/watch?v=OIuoF9Vw1yY', type: 'youtube', name: 'Need some Rest' }, 
{ id: 'https://www.youtube.com/watch?v=vsYj7-Y8JP4', type: 'youtube', name: 'Go to Sleep' }, 
{ id: 'https://www.youtube.com/watch?v=mXpLHdYhMKA', type: 'youtube', name: 'Warrior 1' }, 
{ id: 'https://www.youtube.com/watch?v=J0shA9J-4Nc', type: 'youtube', name: 'Warrior 2' }, 
{ id: 'https://www.youtube.com/watch?v=o-9T184mpY4', type: 'youtube', name: '432hz' }, 
{ id: 'https://www.youtube.com/watch?v=sjkrrmBnpGE', type: 'youtube', name: 'Ambient Study Music' }, 
{ id: 'https://www.youtube.com/watch?v=OoSzt2Ga8Oc', type: 'youtube', name: 'kaizen' }, 
{ id: 'https://www.youtube.com/watch?v=J8t2VNkvMk8', type: 'youtube', name: 'ukiyo' }, 
{ id: 'https://www.youtube.com/watch?v=Zj3v9C3egW0', type: 'youtube', name: 'Anemoia' }, 
{ id: 'https://www.youtube.com/watch?v=rbxnbB3HWpc', type: 'youtube', name: 'palenoia' },
{ id: 'https://www.youtube.com/watch?v=SdBGS5-gAgE', type: 'youtube', name: 'Gazing Garden' }, 
{ id: 'https://www.youtube.com/watch?v=yQs6zk1irEI', type: 'youtube', name: '2:00 am' }, 
{ id: 'https://www.youtube.com/watch?v=QrATXY0IKqI', type: 'youtube', name: 'cottage core' },
{ id: 'https://www.youtube.com/watch?v=0w80F8FffQ4', type: 'youtube', name: 'coding music' },
{ id: 'https://www.youtube.com/watch?v=F02iMCEEQWs', type: 'youtube', name: 'peaceful solitude' },
{ id: 'https://www.youtube.com/watch?v=Fzvi-MyHw6w', type: 'youtube', name: 'Ghibli' },
{ id: 'https://www.youtube.com/watch?v=FjHGZj2IjBk', type: 'youtube', name: 'Monoman' },
{ id: 'https://www.youtube.com/watch?v=qMh14K8WW58', type: 'youtube', name: 'Medieval music' },
{ id: 'https://www.youtube.com/watch?v=MYTfTKGSRr8', type: 'youtube', name: 'Relaxing Sleep Music' },
{ id: 'https://www.youtube.com/watch?v=gVA4xE82QAk', type: 'youtube', name: 'Relaxing Sleep Music 2' },
      ],
    },
  ],
  pixabay: [
    {
      name: 'Nature 1',
      icon: Mountain,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2024/03/12/203923-922675870.mp4', type: 'pixabay', name: 'Grass Fields' },
        { id: 'https://cdn.pixabay.com/video/2024/12/04/244839_large.mp4', type: 'pixabay', name: 'Waves' },
        { id: 'https://cdn.pixabay.com/video/2021/09/11/88207-602915574_medium.mp4', type: 'pixabay', name: 'sunset mountains' },
        { id: 'https://cdn.pixabay.com/video/2025/05/01/275983_medium.mp4', type: 'pixabay', name: 'sea sunset' },
        { id: 'https://cdn.pixabay.com/video/2024/01/20/197439-904825219_medium.mp4', type: 'pixabay', name: 'sea coast' },
        { id: 'https://cdn.pixabay.com/video/2024/03/04/202877-919288692_medium.mp4', type: 'pixabay', name: 'mt fuji' },
        { id: 'https://cdn.pixabay.com/video/2022/12/08/142088-779482307_medium.mp4', type: 'pixabay', name: 'bird 2' },
        { id: 'https://cdn.pixabay.com/video/2024/06/25/218098_medium.mp4', type: 'pixabay', name: 'dragon fly' },
        { id: 'https://cdn.pixabay.com/video/2015/10/18/1085-142801793.mp4', type: 'pixabay', name: 'bubble loop' },
        { id: 'https://cdn.pixabay.com/video/2023/09/18/181115-865745504_medium.mp4', type: 'pixabay', name: 'mt fuji 2' },
        { id: 'https://cdn.pixabay.com/video/2021/05/29/75710-556672010_medium.mp4', type: 'pixabay', name: 'Sakura 2' },
        { id: 'https://cdn.pixabay.com/video/2021/03/03/66836-520427439_medium.mp4', type: 'pixabay', name: 'Sakura 3' },
        { id: 'https://pixabay.com/videos/download/video-68363_medium.mp4', type: 'pixabay', name: 'Sakura 4' },
      ],
    },
    {
      name: 'Nature 2',
      icon: Mountain,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2023/03/09/153976-817104245_small.mp4', type: 'pixabay', name: 'sunset' },
        { id: 'https://cdn.pixabay.com/video/2020/01/18/31377-386628887_medium.mp4', type: 'pixabay', name: 'Ocean waves' },
        { id: 'https://cdn.pixabay.com/video/2023/08/06/174860-852215326_medium.mp4', type: 'pixabay', name: 'river stream' },
        { id: 'https://cdn.pixabay.com/video/2024/02/13/200427-912684284_medium.mp4', type: 'pixabay', name: 'bird' },
        { id: 'https://cdn.pixabay.com/video/2022/03/15/110790-688648716.mp4', type: 'pixabay', name: 'Sakura' },
        { id: 'https://cdn.pixabay.com/video/2025/04/29/275593_medium.mp4', type: 'pixabay', name: 'aerial view salt lake' },
        { id: 'https://cdn.pixabay.com/video/2021/03/03/66810-520427372_medium.mp4', type: 'pixabay', name: 'Grass dew' },
        { id: 'https://cdn.pixabay.com/video/2024/11/27/243521_medium.mp4', type: 'pixabay', name: 'Ocean' },
        { id: 'https://cdn.pixabay.com/video/2024/02/21/201308-915375262_medium.mp4', type: 'pixabay', name: 'Sunset Beach' },
        { id: 'https://cdn.pixabay.com/video/2021/06/04/76437-559159259_medium.mp4', type: 'pixabay', name: 'Coast' },
      ],
    },
    {
      name: 'Rain',
      icon: CloudRain,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2015/08/08/78-135733055.mp4', type: 'pixabay', name: 'raindrop' },
        { id: 'https://cdn.pixabay.com/video/2017/08/30/11722-231759069_small.mp4', type: 'pixabay', name: 'rainy window' },
        { id: 'https://cdn.pixabay.com/video/2023/09/23/181916-867576005.mp4', type: 'pixabay', name: 'raindrop 2' },
        { id: 'https://cdn.pixabay.com/video/2020/06/17/42420-431511648.mp4', type: 'pixabay', name: 'rainy window with pot' },
        { id: 'https://cdn.pixabay.com/video/2016/12/22/6847-196978755.mp4', type: 'pixabay', name: 'raining fields' },
        { id: 'https://cdn.pixabay.com/video/2019/11/06/28781-372045658_medium.mp4', type: 'pixabay', name: 'rainy spider' },
        { id: 'https://cdn.pixabay.com/video/2019/10/24/28236-368501609.mp4', type: 'pixabay', name: 'rainy window' },
        { id: 'https://cdn.pixabay.com/video/2016/09/14/5278-182817488.mp4', type: 'pixabay', name: 'people' },
      ],
    },
    {
      name: 'Cafe',
      icon: Coffee,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2024/02/12/200260-912384743_small.mp4', type: 'pixabay', name: 'ai cafe' },
        { id: 'https://cdn.pixabay.com/video/2020/08/12/46989-449623829_medium.mp4', type: 'pixabay', name: 'coffee' },
        { id: 'https://cdn.pixabay.com/video/2024/02/26/202004-916894674_medium.mp4', type: 'pixabay', name: 'ai restaurant' },
        { id: 'https://cdn.pixabay.com/video/2022/06/29/122504-725502903_medium.mp4', type: 'pixabay', name: 'stir' },
        { id: 'https://cdn.pixabay.com/video/2020/02/11/32246-390923732_medium.mp4', type: 'pixabay', name: 'cup' },
      ],
    },
    {
      name: 'Study',
      icon: Library,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2015/09/27/846-140823862_large.mp4', type: 'pixabay', name: 'Library corridor' },
        { id: 'https://cdn.pixabay.com/video/2022/12/03/141519-777930387_medium.mp4', type: 'pixabay', name: 'Book' },
        { id: 'https://cdn.pixabay.com/video/2022/03/19/111279-690770674_medium.mp4', type: 'pixabay', name: 'Book 2' },
        { id: 'https://cdn.pixabay.com/video/2016/05/12/3188-166339073.mp4', type: 'pixabay', name: 'keyboard typing' },
        { id: 'https://cdn.pixabay.com/video/2015/10/16/1046-142621379.mp4', type: 'pixabay', name: 'work' },
        { id: 'https://cdn.pixabay.com/video/2022/02/09/107240-678130070_medium.mp4', type: 'pixabay', name: 'write' },
      ],
    },
    {
      name: 'Cityscape',
      icon: Building2,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2019/02/01/21116-315137080_large.mp4', type: 'pixabay', name: 'seoul street' },
        { id: 'https://cdn.pixabay.com/video/2021/10/12/91744-636709154_medium.mp4', type: 'pixabay', name: 'skyscraper' },
        { id: 'https://cdn.pixabay.com/video/2024/09/07/230248_medium.mp4', type: 'pixabay', name: 'sunset canal city' },

        { id: 'https://cdn.pixabay.com/video/2019/02/01/21118-315137091_large.mp4', type: 'pixabay', name: 'seoul street 2' },
        { id: 'https://cdn.pixabay.com/video/2023/06/25/168811-839864556_medium.mp4', type: 'pixabay', name: 'car roundabout' },
        { id: 'https://cdn.pixabay.com/video/2021/08/13/84973-587646755_medium.mp4', type: 'pixabay', name: 'people' },
        { id: 'https://cdn.pixabay.com/video/2019/02/01/21115-315137069_large.mp4', type: 'pixabay', name: 'seoul street 3' },
        { id: 'https://cdn.pixabay.com/video/2017/11/09/12866-242215707_medium.mp4', type: 'pixabay', name: 'Dubrovnik' },
      ],
    },
    {
      name: 'Sci-Fi',
      icon: Rocket,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2020/11/20/56932-481961548_medium.mp4', type: 'pixabay', name: 'warp' },
        { id: 'https://cdn.pixabay.com/video/2021/12/14/100549-657153127_medium.mp4', type: 'pixabay', name: 'scifi tunnel' },
        { id: 'https://cdn.pixabay.com/video/2022/07/18/124593-731586258_medium.mp4', type: 'pixabay', name: 'wormwhole' },
        { id: 'https://pixabay.com/videos/download/video-65495_medium.mp4', type: 'pixabay', name: 'scifi tunnel 2' },
        { id: 'https://cdn.pixabay.com/video/2021/04/02/69727-533374268_medium.mp4', type: 'pixabay', name: 'planet' },
        { id: 'https://cdn.pixabay.com/video/2024/06/17/217118_medium.mp4', type: 'pixabay', name: 'star sky' },
        { id: 'https://cdn.pixabay.com/video/2023/02/03/149175-795746665_medium.mp4', type: 'pixabay', name: 'abstract loop' },
        { id: 'https://cdn.pixabay.com/video/2023/09/06/179333-861795769_medium.mp4', type: 'pixabay', name: 'scifi tunnel 3' },
        { id: 'https://cdn.pixabay.com/video/2022/03/29/112256-693798366_medium.mp4', type: 'pixabay', name: 'network' },
        { id: 'https://cdn.pixabay.com/video/2018/03/09/14900-259623335_medium.mp4', type: 'pixabay', name: 'cables' },
      ],
    },
    {
      name: 'Snow',
      icon: Snowflake,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2021/05/07/73430-548173446_medium.mp4', type: 'pixabay', name: 'snowfall' },
        { id: 'https://cdn.pixabay.com/video/2025/03/29/268537_medium.mp4', type: 'pixabay', name: 'snowy train' },
        { id: 'https://cdn.pixabay.com/video/2024/06/02/214940_medium.mp4', type: 'pixabay', name: 'snowy temple' },
        { id: 'https://cdn.pixabay.com/video/2023/02/25/152109-802330837_medium.mp4', type: 'pixabay', name: 'snowy woods' },
        { id: 'https://cdn.pixabay.com/video/2017/01/13/7328-199383367_large.mp4', type: 'pixabay', name: 'snowy trees' },
      ],
    },
    {
      name: 'Fire',
      icon: Flame,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2022/02/04/106674-673786323_small.mp4', type: 'pixabay', name: 'cozy cabin' },
        { id: 'https://cdn.pixabay.com/video/2022/02/13/107573-678540733_medium.mp4', type: 'pixabay', name: 'cozy cabin 2' },
        { id: 'https://cdn.pixabay.com/video/2022/01/12/104109-665395712_medium.mp4', type: 'pixabay', name: 'cozy cabin 3' },
        { id: 'https://cdn.pixabay.com/video/2021/10/27/93480-640562082_medium.mp4', type: 'pixabay', name: 'candle' },
        { id: 'https://cdn.pixabay.com/video/2023/11/26/190776-888535446_medium.mp4', type: 'pixabay', name: 'fireplace' },
        { id: 'https://cdn.pixabay.com/video/2024/02/27/202222-917699797_medium.mp4', type: 'pixabay', name: 'fireplace 2' },
        { id: 'https://cdn.pixabay.com/video/2023/01/30/148594-794221537_medium.mp4', type: 'pixabay', name: 'camping' },
      ],
    },
    {
      name: 'Anime',
      icon: Star,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2024/05/30/214500_medium.mp4', type: 'pixabay', name: 'studying girl' },
        { id: 'https://cdn.pixabay.com/video/2024/06/05/215407_medium.mp4', type: 'pixabay', name: 'studying girl 2' },
        { id: 'https://cdn.pixabay.com/video/2025/05/03/276498_medium.mp4', type: 'pixabay', name: 'studying girl 3' },
        { id: 'https://cdn.pixabay.com/video/2024/05/22/213042_medium.mp4', type: 'pixabay', name: 'EYE' },
        { id: 'https://cdn.pixabay.com/video/2025/04/07/270507_medium.mp4', type: 'pixabay', name: 'CAT' },
        { id: 'https://cdn.pixabay.com/video/2021/11/26/98970-650472561.mp4', type: 'pixabay', name: 'Tree on window' },
        { id: 'https://cdn.pixabay.com/video/2025/04/13/271841.mp4', type: 'pixabay', name: 'Girl with cat' },
        { id: 'https://cdn.pixabay.com/video/2025/04/09/270983_large.mp4', type: 'pixabay', name: 'cozy' },
        { id: 'https://cdn.pixabay.com/video/2021/10/10/91562-629172467_medium.mp4', type: 'pixabay', name: 'scenery' },
      ],
    },
    {
      name: 'Misc',
      icon: Shapes,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2024/09/19/232169_medium.mp4', type: 'pixabay', name: 'traffic light' },
        { id: 'https://cdn.pixabay.com/video/2019/11/08/28860-372055467_medium.mp4', type: 'pixabay', name: 'bokeh' },
        { id: 'https://cdn.pixabay.com/video/2021/06/25/78891-567754579_medium.mp4', type: 'pixabay', name: 'triangle in ocean' },
        { id: 'https://cdn.pixabay.com/video/2021/02/16/65390-514139029_medium.mp4', type: 'pixabay', name: 'vinyl' },
        { id: 'https://cdn.pixabay.com/video/2019/02/19/21536-318978190_medium.mp4', type: 'pixabay', name: 'paint in water' },
        { id: 'https://cdn.pixabay.com/video/2021/03/08/67358-521707474_medium.mp4', type: 'pixabay', name: 'paint in water 2' },
        { id: 'https://cdn.pixabay.com/video/2022/08/21/128586-741747743_medium.mp4', type: 'pixabay', name: 'windmill' },
      ],
    },
  ],
};

export const allWallpapers: Wallpaper[] = [
  ...wallpaperData.mySelections,
  ...wallpaperData.youtube.flatMap(cat => cat.wallpapers),
  ...wallpaperData.pixabay.flatMap(cat => cat.wallpapers),
].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Remove duplicates