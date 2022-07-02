import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Collapse from "antd/lib/collapse";
import { Button } from "../ui";

const { Panel } = Collapse;

export const CollapseWithButtons = ({ dataLists = [] }) => {
  return (
    <CollapseAntd accordion bordered={false} expandIcon={null}>
      {dataLists.map((dataList, index) => (
        <Panel
          key={index}
          header={
            <Button width="100%">
              <div className="content-button">
                <div className="item-icon">
                  <img src={dataList.image} alt={dataList.title} />
                </div>
                <div className="item-text">
                  <h5>{dataList.title}</h5>
                </div>
              </div>
            </Button>
          }
          className="site-collapse-custom-panel"
        >
          <div className="content-description">
            <div>
              <h4>BENEFICIOS:</h4>
            </div>
            <div>
              <ul className="list-benefits">
                {dataList.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="item-link">
              <a href={dataList.urlFile} rel="noreferrer">
                <FontAwesomeIcon icon={faDownload} size="2x" />
                Descargar Ficha de Solicitud
              </a>
            </div>
          </div>
        </Panel>
      ))}
    </CollapseAntd>
  );
};

const CollapseAntd = styled(Collapse)`
  .content-button {
    width: 100%;
    display: grid;
    grid-template-columns: 17% 1fr;
    grid-column-gap: 1rem;
    position: relative;
    .item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 4rem;
        height: 4rem;
        object-fit: contain;
      }
    }
    .item-text {
      display: flex;
      align-items: center;
      justify-content: start;
      font-size: 100%;
      h5 {
        text-align: left;
        width: 95%;
        max-width: 100%;
        text-transform: uppercase;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
      }
    }
  }
  .content-description {
    div {
      .list-benefits {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 0.77rem;
        li {
          margin-bottom: 0.5rem;
        }
      }
    }
    .item-link {
      color: dodgerblue;
      text-decoration: underline;
      text-transform: uppercase;
      text-align: center;
      margin: 1.5rem 0;
      font-size: 1em;
      svg {
        margin-right: 1rem;
      }
    }
  }
`;