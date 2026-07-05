// Central catalog of all image assets from Wonder designs
// These are the exact same images used in the Wonder design files

const CDN_BASE = 'https://cdn.wonder.so/images/019f23b3-829f-7ab8-822d-8412ab147f8e';

export const images = {
  // Background scenes
  backgrounds: {
    landingGlobeDesk: `${CDN_BASE}/4e4fa89dc97521ae99be7a127db4c8ce11808d550732aa4f26330f7ef032cf2d.jpg`,
    atlasGlobeScene: `${CDN_BASE}/f9b76466ef13c05c967315d4b8e4120db16f354510d69b6306f84ec16ad2449e.jpg`,
    newDelhiMiniature: `${CDN_BASE}/f7be41f0a8fc6cba7d2fd7590d91ebf7e0150f2c674a6b40259cc1b6f1da24bc.jpg`,
    parisMiniature: `${CDN_BASE}/ff45afb847a99359dc824b2f04a441f0fbda0ed697de093c84fedae9a9f280cd.jpg`,
    tokyoMiniature: `${CDN_BASE}/1a5f8277f2b22be21b32908f61fe8f9d643b6ff38f5c3ecc3aacdbbdac75c49a.jpg`,
    letterWriting: `${CDN_BASE}/64fc1ba3d1249b4cf8e2b79641447a9f179fab8112ec8bae2c12c5dc21a1baad.jpg`,
    memoryTree: `${CDN_BASE}/89a64a0cd3250012af680825b6a3e891d12e89985e4ced16bed49e1f85473fdd.jpg`,
  },

  // Chapter thumbnails (Atlas page - Recent Chapters panel)
  chapters: {
    kyoto: `${CDN_BASE}/f4a8ab4b59f5c1ad56b841a5a039759f2d7396b785603b44f60049ac78d7795c.jpg`,
    paris: `${CDN_BASE}/ff45afb847a99359dc824b2f04a441f0fbda0ed697de093c84fedae9a9f280cd.jpg`,
    iceland: `${CDN_BASE}/18f04d44d1a2c497ca7c7f121f6c923c7685001b8df74f47fd1229aac3461fcd.jpg`,
  },

  // Polaroid photos
  polaroids: {
    indiaGateGoldenHour: `${CDN_BASE}/02662f17f4d1b973922c270547d23ae4afc23cc1d1ea262b5bf2282cf769a239.jpg`,
  },

  // Stamp collection
  stamps: {
    indiaGate: `${CDN_BASE}/f45f371986146b377ecb604def6c068a2f2aa92a282c8773f45212ec67569ae9.jpg`,
    redFort: `${CDN_BASE}/95cff271fbd4309408cec06e5aea60d441f95118e79409048e796dc2577daaea.jpg`,
    humayunsTomb: `${CDN_BASE}/3611a50b4e90f82c21fd3b7d4d3ab2cae4c324c9c0f535d8a0aebc937fb999f7.jpg`,
    qutubMinar: `${CDN_BASE}/8520b95f1dac890831a40ac3e9495c53862348419b0037ed1a76a984aab7f219.jpg`,
    lotusTemple: `${CDN_BASE}/07b6052dd9a3d76b952a7bd969b1798041fce69f780fdbf09aa65f5122c56959.jpg`,
    akshardham: `${CDN_BASE}/0e90fbaaacbb0d70a372c15dce33939a535edb078d0330741f1d344b55bf9a5f.jpg`,
  },

  // Journey cards (Memory Tree - Recent Journeys strip)
  journeyCards: {
    newDelhi: `${CDN_BASE}/ba274c00b8a6872a7497d61b885f65d2cbab6f3761e9e76e1d080158002b1cc4.jpg`,
    kyoto: `${CDN_BASE}/aef45e77acded691178a8c03e2a3768fd06887572b993539eb5383f1a10b5e8a.jpg`,
    florence: `${CDN_BASE}/ea21598bd41a3fffd40b975fbdea7e60346541a988343cd7c72ee236f5ad68b7.jpg`,
    reykjavik: `${CDN_BASE}/0883c47c3d82361c99dc0e045efb15c2d39f31a784730c41aa35fa03f9811a75.jpg`,
    lisbon: `${CDN_BASE}/3d955ff52049c4aa3af468421d58cd96d49ea0e82c0a0db55a6f52dedc8b2c5b.jpg`,
    marrakech: `${CDN_BASE}/2c73325eba9f7e569792e3e4d3b6b9eebdb21e51d2356ca791b780079a1c6ca1.jpg`,
  },
};

export default images;
