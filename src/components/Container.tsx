import React, { useCallback, useState } from "react";

import { Block } from "./Block";
import { TextBlock } from "../controller/Block/TextBlock";

import "../style/container.css";
import { useGenerateContainer } from "./ContainerHooks";
import { EditorBlock } from "../controller/Block/EditorBlock";
import { TEXT_STYLE, TEXT_TYPE } from "../controller/Block/IEditorBlock";

function Container() {
  const containerInstance = useGenerateContainer();
  const [blockArray, setBlockArray] = useState(
    containerInstance.current.getBlocks()
  );

  const syncBlockState = useCallback((newBlockArrayState) => {
    setBlockArray(newBlockArrayState.slice());
    console.log("container update", newBlockArrayState.slice());
  }, []);

  const handleClickContainer = () => {
    const editorBlocks: EditorBlock[] = containerInstance.current.getBlocks();
    const lastBlock: EditorBlock = editorBlocks[editorBlocks.length - 1];
    if (!lastBlock || lastBlock.ref.innerHTML !== "") {
      const testTextBlock = new TextBlock(Date.now(), "text", []);
      containerInstance.current.insertBlock(-1, testTextBlock);
      const blocksArray = containerInstance.current.getBlocks().slice();
      // due to useRef, manually calling rerendering
      setBlockArray(blocksArray);
    }
  };

  const handleSelection = (type: TEXT_STYLE) => {
    const selectedInfo = containerInstance.current.getCurrentSelectedBlock();
    if (selectedInfo) {
      const targetBlock = containerInstance.current.getBlockByKey(
          selectedInfo.blockKey
      );
      if (targetBlock !== 0) {
        (targetBlock as TextBlock).markSelectedText(
            type,
            selectedInfo.selectionStart,
            selectedInfo.selectionEnd
        );
        targetBlock.setKey(Date.now());
        console.log("container", containerInstance.current.getBlocks());
        syncBlockState(containerInstance.current.getBlocks());
      }
    }
  };

  return (
    <>
      <button onClick={() => {handleSelection(TEXT_STYLE.marked)}}>mark</button>
      <button onClick={() => {handleSelection(TEXT_STYLE.bold)}}>bold</button>
      <div className="container" onClick={handleClickContainer}>
        {blockArray.map((block) => {
          return (
            <Block
              key={block.key}
              blockKey={block.key}
              blockInfo={block}
              containerInfo={containerInstance.current}
              syncState={syncBlockState}
            />
          );
        })}
      </div>
    </>
  );
}

export { Container };
