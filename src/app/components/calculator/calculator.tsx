"use client";
import React from "react";
import { Badge, Dropdown, Label, Progress, TextInput } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { Table } from "flowbite-react";

import product1 from "/public/images/products/dash-prd-1.jpg";
import product2 from "/public/images/products/dash-prd-2.jpg";
import product3 from "/public/images/products/dash-prd-3.jpg";
import product4 from "/public/images/products/dash-prd-4.jpg";
import product5 from "/public/images/products/s5.jpg";
import Image from "next/image";

const CalculatorManageComponent = () => {
    const ProductTableData = [
      {
        img: product1,
        name: "iPhone 13 pro max-Pacific Blue-128GB storage",
        payment: "$180",
        paymentstatus: "Partially paid",
        process: 45,
        processcolor: "bg-warning",
        statuscolor: "secondary",
        statustext: "Confirmed",
      },
      {
        img: product2,
        name: "Apple MacBook Pro 13 inch-M1-8/256GB-space",
        payment: "$120",
        paymentstatus: "Full paid",
        process: 100,
        processcolor: "bg-success",
        statuscolor: "success",
        statustext: "Confirmed",
      },
      {
        img: product3,
        name: "PlayStation 5 DualSense Wireless Controller",
        payment: "$120",
        paymentstatus: "Cancelled",
        process: 100,
        processcolor: "bg-error",
        statuscolor: "error",
        statustext: "Cancelled",
      },
      {
        img: product4,
        name: "Amazon Basics Mesh, Mid-Back, Swivel Office",
        payment: "$120",
        paymentstatus: "Partially paid",
        process: 45,
        processcolor: "bg-warning",
        statuscolor: "secondary",
        statustext: "Confirmed",
      },
    ];
  
    /*Table Action*/
    const tableActionData = [
      {
        icon: "solar:add-circle-outline",
        listtitle: "Add",
      },
      {
        icon: "solar:pen-new-square-broken",
        listtitle: "Edit",
      },
      {
        icon: "solar:trash-bin-minimalistic-outline",
        listtitle: "Delete",
      },
    ];
  
    return (
      <>
        <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6  relative w-full break-words">
          <h5 className="card-title">การคำนวนอาหาร</h5>
          <div className="flex">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <div className="font-semibold text-dark">การคำนวนอาหารปั่นผสม</div>
              <div className="font-semibold text-dark">สูตร BD 1:1 300 ml * 4 feed</div>
              <div className="font-semibold text-dark">คำสั่งเฉพาะ เบาหวาน</div>
            </div>
            <div className="flex-1 text-end">
              <div className="font-semibold text-dark">ทั่วไป 55:15:30</div>
              <div className="font-semibold text-dark">เบาหวาน 50:20:30</div>
            </div>
          </div>
          <div className="mt-3">
              <div className="overflow-x-auto">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell className="w-[25%]">การกระจายพลังงาน</Table.HeadCell>
                    <Table.HeadCell>พลังงาน (kcal)</Table.HeadCell>
                    <Table.HeadCell>CHO (%)</Table.HeadCell>
                    <Table.HeadCell>Protein (%)</Table.HeadCell>
                    <Table.HeadCell>Fat (%)</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                    <Table.Row key={1}>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">ปริมาตร</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <TextInput
                              id="name"
                              type="text"
                              placeholder="0"
                              className="form-control form-rounded-xl text-end"
                            />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <TextInput
                              id="name"
                              type="text"
                              placeholder="0"
                              className="form-control form-rounded-xl text-end"
                            />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <TextInput
                              id="name"
                              type="text"
                              placeholder="0"
                              className="form-control form-rounded-xl text-end"
                            />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <TextInput
                              id="name"
                              type="text"
                              placeholder="0"
                              className="form-control form-rounded-xl text-end"
                            />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row key={2}>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <TextInput
                              id="name"
                              type="text"
                              placeholder="0"
                              className="form-control form-rounded-xl text-center"
                            />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'CHO (kcal)'}</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'Protein (kcal)'}</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'Fat (kcal)'}</label>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row key={3}>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">มิลลิลิตร</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row key={4}>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'CHO (g.)'}</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'Protein (g.)'}</label>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <label className="font-semibold text-dark">{'Fat (g.)'}</label>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row key={5}>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap"></Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                      <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                      <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          0
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
           
          </div>
        </div>
      </>
    );
  };
  
  export default CalculatorManageComponent;