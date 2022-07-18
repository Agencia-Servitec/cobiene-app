import React, { useState } from "react";
import { useGlobal } from "reactn";
import styled, { css } from "styled-components";
import { defaultTo, toNumber } from "lodash";
import ModalAntd from "antd/lib/modal/Modal";
import { mediaQuery } from "../../styles/constants/mediaQuery";
import { Input } from "./Input";
import { Form } from "./Form";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../hooks";
import { Button } from "./Button";
import { InputNumber } from "./InputNumber";
import { TextArea } from "./TextArea";
import { Select } from "./Select";
import { phoneCodes } from "../../data-list";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { notification } from "./notification";
import { currentConfig } from "../../firebase";

export const FormPractice = () => {
  const [visibleFormContact, setVisibleFormContact] =
    useGlobal("visibleFormContact");

  const [loadingSendEmail, setLoadingSendEmail] = useState(false);

  const handledVisibleFormContact = () =>
    setVisibleFormContact(!visibleFormContact);

  const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    countryCode: yup.string().required(),
    phoneNumber: yup.number().required(),
    email: yup.string().email().required(),
    issue: yup.string().required(),
    message: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { error, required } = useFormUtils({ errors, schema });

  const onSubmitFromContact = async (formData) => {
    try {
      setLoadingSendEmail(true);
      const contact = mapContact(formData);

      const response = await fetch(
        `${currentConfig.sendingEmailsApi}/others/contact`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": null,
            "content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(contact),
        }
      );

      if (!response.ok) throw new Error(response.message);
      resetContactFrom();
      notification({ type: "success", title: "Enviado exitoso" });
    } catch (e) {
      console.error("SendingEmail", e);
      notification({
        type: "error",
      });
    } finally {
      handledVisibleFormContact();
      setLoadingSendEmail(false);
    }
  };

  const mapContact = (formData) => ({
    contact: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: {
        countryCode: formData.countryCode,
        number: toNumber(formData.phoneNumber),
      },
      issue: formData.issue,
      maessage: formData.message,
    },
  });

  const resetContactFrom = () =>
    reset({
      firstName: "",
      lastName: "",
      countryCode: "+51",
      phoneNumber: "",
      email: "",
      issue: "",
      message: "",
    });

  return (
    <ModalComponent
      title={<h3 style={{ margin: "0" }}>Contactanos</h3>}
      visible={visibleFormContact}
      onOk={() => handledVisibleFormContact()}
      footer={null}
    >
      <Form onSubmit={handleSubmit(onSubmitFromContact)}>
        <Row gutter={[16, 15]}>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese nombres"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese apellidos"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese email"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={9}>
            <Controller
              name="countryCode"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Ingrese codigo"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                  options={phoneCodes.map((phoneCode) => ({
                    code: phoneCode.code,
                    value: phoneCode.dial_code,
                    label: `${phoneCode.name} (${phoneCode.dial_code})`,
                  }))}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={15}>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <InputNumber
                  label="Ingrese telefono"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="issue"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Ingrese asunto"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Ingrese mensaje"
                  onChange={onChange}
                  value={value}
                  name={name}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button
              type="tertiary"
              block
              onClick={() => handledVisibleFormContact()}
              disabled={loadingSendEmail}
            >
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={24} md={16}>
            <Button
              htmlType="submit"
              block
              loading={loadingSendEmail}
              disabled={loadingSendEmail}
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </Form>
    </ModalComponent>
  );
};
const ModalBackground = css`
  background-color: ${({ backgroundModal, theme }) =>
    defaultTo(backgroundModal, theme.colors.dark)};
  color: ${({ theme }) => theme.colors.font2};
`;

const ModalComponent = styled(ModalAntd)`
  position: relative;
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0;
  top: 0;
  z-index: 9999999 !important;

  ${mediaQuery.minTablet} {
    min-width: inherit;
    min-height: inherit;
    width: inherit;
    height: auto;
    top: 2vh;
  }
  .ant-modal-content {
    position: absolute;
    inset: 0;
    ${ModalBackground};

    .ant-modal-header {
      ${ModalBackground};
      border-bottom: 1px solid #53575a;

      .ant-modal-title {
        color: ${({ theme }) => theme.colors.font1};
        h2 {
          margin: 0;
        }
      }
    }

    .ant-modal-close {
      color: ${({ theme }) => theme.colors.font1};
    }

    .ant-modal-body {
      min-height: 100vh;
      height: auto;
      ${mediaQuery.minTablet} {
        min-height: auto;
      }
      ${ModalBackground};
    }
  }
`;
