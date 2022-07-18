import ModalAntd from "antd/lib/modal/Modal";
import styled, { css } from "styled-components";
import { Input } from "./Input";
import { useGlobal } from "reactn";
import { Controller, useForm } from "react-hook-form";
import { Form, Button, InputNumber, TextArea, Select, notification } from "./";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { defaultTo } from "lodash";
import { mediaQuery } from "../../styles/constants/mediaQuery";
import { useFormUtils, useDevice } from "../../hooks";
import { phoneCodes } from "../../data-list";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import React, { useState } from "react";
import { currentConfig } from "../../firebase";

export const PracticeFormContact = () => {
  // usando el useGlobal en un stat
  const [visibleFormContact, setVisibleFormContact] =
    useGlobal("visibleFormContact");

  const [loadingContact, setloadingContact] = useState(false);

  //funcion que retorna lo contrario
  const handleVisibleFormContact = () =>
    setVisibleFormContact(!visibleFormContact);

  const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    countryCode: yup.string().required(),
    phoneNumber: yup.number().required(),
    issue: yup.string().required(),
    message: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmitFormContact = async (formData) => {
    try {
      setloadingContact(true);
      const contact = mapContact(formData);

      const response = await fetchSendEmail(contact);

      if (!response.ok) throw new Error(response.message);

      notification({ type: "success", title: "Enviado exitosamente" });
      resetContactForm();
      return handleVisibleFormContact();
    } catch (e) {
      console.log("Error email send:", e);
      notification({ type: "error" });
    } finally {
      setloadingContact(false);
    }
  };

  const fetchSendEmail = async (contact) =>
    await fetch(`${currentConfig.sendingEmailsApi}/others/contact`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": null,
        "content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(contact),
    });

  const mapContact = (formData) => ({
    contact: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: {
        countryCode: formData.countryCode,
        number: formData.phoneNumber,
      },
      issue: formData.issue,
      message: formData.message,
    },
  });

  const resetContactForm = () =>
    reset({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+51",
      phoneNumber: "",
      issue: "",
      message: "",
    });

  return (
    <ModalComponent
      title={<h3 style={{ color: "#fff" }}>Contactanos</h3>}
      visible={visibleFormContact}
      footer={null}
      onOk={() => handleVisibleFormContact()}
      onCancel={() => handleVisibleFormContact()}
    >
      <Form onSubmit={handleSubmit(onSubmitFormContact)}>
        <Row gutter={[16, 15]}>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Ingrese nombre"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="lastName"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Ingrese apellidos"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Ingrese email"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="countryCode"
              defaultValue="+51"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <Select
                  label="Ingrese codigo"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                  options={phoneCodes.map((phoneCode) => ({
                    code: phoneCode.code,
                    value: phoneCode.dial_code,
                    label: `${phoneCode.name} (${phoneCode.dial_code})`,
                  }))}
                />
              )}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Controller
              name="phoneNumber"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <InputNumber
                  label="Ingrese telefono"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="issue"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <Input
                  label="Ingrese asunto"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="message"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <TextArea
                  label="Mensaje..."
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Button
              block
              type="tertiary"
              onClick={() => handleVisibleFormContact()}
              margin="0"
              disabled={loadingContact}
            >
              Cancelar
            </Button>
          </Col>

          <Col xs={24} sm={24} md={24} lg={16}>
            <Button
              htmlType="submit"
              block
              type="primary"
              margin="0"
              loading={loadingContact}
              disabled={loadingContact}
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
