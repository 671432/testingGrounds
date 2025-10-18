import { useEffect, useState } from "react";
import "./gameLinkCombiner.css";

export default function GameLinkCombiner() {
  const [itemId, setItemId] = useState("[&AgFqLwAA]"); // Stick of Butter
  const [quantity, setQuantity] = useState(1);
  const [upgrade1Id, setUpgrade1Id] = useState("[&AgE3YQAA]"); // Sigil
  const [upgrade2Id, setUpgrade2Id] = useState("");
  const [skinId, setSkinId] = useState("");
  const [result, setResult] = useState("-");

  const [itemData, setItemData] = useState<any>(null);
  const [_upgrade1Data, setUpgrade1Data] = useState<any>(null);
  const [_upgrade2Data, setUpgrade2Data] = useState<any>(null);
  const [skinData, setSkinData] = useState<any>(null);
  const [combinedName, setCombinedName] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // === helper functions ===
  function generateChatCodeForItem(
    itemId: number,
    quantity: number,
    upgrade1Id?: number,
    upgrade2Id?: number,
    skinId?: number
  ) {
    const separator =
      16 * ((skinId ? 8 : 0) + (upgrade1Id ? 4 : 0) + (upgrade2Id ? 2 : 0));
    const ids = [
      2,
      quantity % 256,
      itemId,
      separator,
      skinId,
      upgrade1Id,
      upgrade2Id,
    ];
    const lengths = [
      1,
      1,
      3,
      1,
      skinId ? 4 : 0,
      upgrade1Id ? 4 : 0,
      upgrade2Id ? 4 : 0,
    ];

    const bytes: number[] = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < lengths[i]; j++) {
        bytes.push(((ids[i] as number) >> (8 * j)) & 0xff);
      }
    }

    const output = window.btoa(String.fromCharCode.apply(null, bytes as any));
    return `[&${output}]`;
  }

  function decodeChatCode(fullcode: string): number {
    if (!/^\[\&/.test(fullcode)) {
      return 0;
    }

    const code = fullcode.replace(/^\[\&+|\]+$/g, "");

    let binary: string;
    try {
      binary = window.atob(code);
    } catch (e) {
      console.warn("Invalid chat code:", fullcode);
      return 0; // return 0 on invalid input
    }

    const octets = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      octets[i] = binary.charCodeAt(i);
    }

    if (octets) {
      if (octets[0] === 2) {
        return (
          octets[2] * 1 + (octets[3] << 8) + (octets[4] ? octets[4] << 16 : 0)
        );
      } else if (octets[0] === 11) {
        return (
          octets[1] * 1 + (octets[2] << 8) + (octets[3] ? octets[4] << 16 : 0)
        );
      } else {
        alert(fullcode + " must be a valid chat code");
      }
    }

    return 0;
  }

  async function fetchItemData(id: number): Promise<any | null> {
    try {
      const res = await fetch(`https://api.guildwars2.com/v2/items/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }

  async function fetchSkinData(id: number): Promise<any | null> {
    try {
      const res = await fetch(`https://api.guildwars2.com/v2/skins/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }

  function getRarityColor(rarity?: string): string {
    switch (rarity) {
      case "Junk":
        return "#AAAAAA";
      case "Basic":
        return "#FFFFFF";
      case "Fine":
        return "#62A4DA";
      case "Masterwork":
        return "#1a9306";
      case "Rare":
        return "#fcd00b";
      case "Exotic":
        return "#ffa405";
      case "Ascended":
        return "#fb3e8d";
      case "Legendary":
        return "#4C139D";
      default:
        return "#ccc";
    }
  }

  // === recompute + fetch names ===
  useEffect(() => {
    const item = decodeChatCode(itemId) || parseInt(itemId);
    const up1 = decodeChatCode(upgrade1Id) || parseInt(upgrade1Id);
    const up2 = decodeChatCode(upgrade2Id) || parseInt(upgrade2Id);
    const skin = decodeChatCode(skinId) || parseInt(skinId);

    const code = generateChatCodeForItem(item, quantity, up1, up2, skin);
    setResult(code);

    function cleanUpgradeName(name?: string | null): string | null {
      if (!name) return null;
      return name
        .replace(/^Superior Sigil of /i, "")
        .replace(/^Major Sigil of /i, "")
        .replace(/^Minor Sigil of /i, "")
        .replace(/^Sigil of /i, "")
        .replace(/^Superior Rune of /i, "")
        .replace(/^Major Rune of /i, "")
        .replace(/^Minor Rune of /i, "")
        .replace(/^Rune of /i, "")
        .replace(/^Mark of /i, "")
        .trim();
    }

    async function fetchAll() {
      const [itemData, up1Data, up2Data, skinData] = await Promise.all([
        item ? fetchItemData(item) : null,
        up1 ? fetchItemData(up1) : null,
        up2 ? fetchItemData(up2) : null,
        skin ? fetchSkinData(skin) : null,
      ]);
      setItemData(itemData);
      setUpgrade1Data(up1Data);
      setUpgrade2Data(up2Data);
      setSkinData(skinData);

      let baseName = (skinData?.name ?? itemData?.name) || "Unknown Item";
      let name = quantity > 1 ? `${quantity} ${baseName}` : baseName;
      const up1Name = cleanUpgradeName(up1Data?.name);
      //const up2Name = cleanUpgradeName(up2Data?.name);

      /*
      if (up1Name && up2Name) name += ` of ${up1Name} and ${up2Name}`;
      else if (up1Name) name += ` of ${up1Name}`;
      else if (up2Name) name += ` of ${up2Name}`;
      */
      if (up1Name) name += ` of ${up1Name}`;
      setCombinedName(name);
    }

    fetchAll();
  }, [itemId, quantity, upgrade1Id, upgrade2Id, skinId]);

  return (
    <div className="game-link-combiner-wrapper">
      <div className="game-link-combiner">
        <h1>Guild Wars 2 Chat Code Combiner</h1>
        <div className="form">
          <div>
            <label>Item (ID or item code)</label>
            <input value={itemId} onChange={(e) => setItemId(e.target.value)} />
            <span className="inline-desc">
              Can be any item/gear, but no skins
            </span>
          </div>
          <div>
            <label>Upgrade 1 (ID or code)</label>
            <input
              value={upgrade1Id}
              onChange={(e) => setUpgrade1Id(e.target.value)}
            />
            <span className="inline-desc">
              has to be an upgrade (sigil, rune, mark, etc)
            </span>
          </div>
          <div>
            <label>Upgrade 2 (ID or code)</label>
            <input
              value={upgrade2Id}
              onChange={(e) => setUpgrade2Id(e.target.value)}
            />
            <span className="inline-desc">
              Upgrade 2 afaik doesn't have an effect on item names
            </span>
          </div>
          <div>
            <label>Skin (Wardrobe ID)</label>
            <input value={skinId} onChange={(e) => setSkinId(e.target.value)} />
          </div>
          <div>
            <label>Quantity (1-255)</label>
            <input
              type="number"
              min={1}
              max={255}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(255, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
            />
          </div>
        </div>
        <p className="result">
          Game Link:{" "}
          <button
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(result);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <samp>{result}</samp>
          </button>
          {copied && <span className="copied-popup">Copied!</span>}
        </p>
        {combinedName && (
          <div>
            <div className="preview">
              {skinData?.icon || itemData?.icon ? (
                <img
                  src={skinData?.icon ?? itemData?.icon}
                  alt={combinedName}
                  width={32}
                  height={32}
                />
              ) : null}
              <span
                style={{
                  color: getRarityColor(skinData?.rarity ?? itemData?.rarity),
                  fontWeight: "bold",
                }}
              >
                [{combinedName}]
              </span>
            </div>
            <p>
              The above is what is expected to be linked in-game, but it might
              not always be 100% correct
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
