import "./StudentPage.css";
import { useEffect, useState } from "react";
import { deleteStudent, getAllStudents } from "./client";
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Row,
  Space,
  Table,
  Tag,
  Badge,
  Avatar,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LoadingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import StudentDrawerForm from "./StudentDrawerForm";
import {
  deleteNotification,
  requestErrorNotification,
} from "../../shared/Notification";

const { Search } = Input;

const CustomAvatar = ({ name }) => {
  let trim = name.trim();
  if (trim.length === 0) {
    return <Avatar icon={UserOutlined} />;
  }
  if (trim.length === 1) {
    return <Avatar>{trim}</Avatar>;
  }
  return <Avatar>{`${trim.charAt(0)}${trim.charAt(trim.length - 1)}`}</Avatar>;
};

const columns = [
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (_, student) => <CustomAvatar name={student.name} />,
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (_, student) => {
      let color;
      switch (student.gender) {
        case "FEMALE":
          color = "red";
          break;
        case "MALE":
          color = "blue";
          break;
        default:
          color = "grey";
      }
      return (
        <Tag color={color} key={student.gender}>
          {student.gender.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];

const menu = (
  <Menu>
    <Menu.Item key="actionOne">
      <button
        className="custom-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        Action One
      </button>
    </Menu.Item>
    <Menu.Item key="actionTwo">
      <button
        className="custom-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        Action Two
      </button>
    </Menu.Item>
  </Menu>
);

const Loading = () => (
  <Row type="flex" align="middle">
    <Col span={12} offset={11}>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <LoadingOutlined style={{ fontSize: 54 }} spin />
      </div>
    </Col>
  </Row>
);

function StudentPage({ setBreadcrumbList }) {
  // React Component state
  const [students, setStudents] = useState([]);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const onInit = () => {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, student) => (
        <Space size="middle">
          <button
            className="custom-button"
            onClick={() => {
              setStudentToEdit(student);
              setShowDrawer(true);
            }}
          >
            <EditOutlined style={{ fontSize: 20 }} />
          </button>
          <Popconfirm
            placement="topRight"
            title={
              <span>
                do you want to <strong>delete</strong> this student?
              </span>
            }
            onConfirm={() => onDeleteConfirm(student)}
            okText="Yes"
            cancelText="No"
          >
            <button className="custom-button" style={{ color: "red" }}>
              <DeleteOutlined style={{ fontSize: 20 }} />
            </button>
          </Popconfirm>
        </Space>
      ),
    });
  };

  const onReload = (searchText) =>
    getAllStudents(searchText)
      .then((data) => {
        setStudents(data);
      })
      .catch(requestErrorNotification)
      .finally(() => setFetching(false));

  const onDeleteConfirm = (student) =>
    deleteStudent(student)
      .then(() => {
        deleteNotification(
          "Student deleted",
          <span>
            deleted student id: <strong>{student.id}</strong> name:{" "}
            <strong>{student.name}</strong> from system
          </span>
        );
        onReload();
      })
      .catch(requestErrorNotification);

  // fetching data once the React Component is loaded
  useEffect(() => {
    setBreadcrumbList(["User", "Students"]);
    onInit();
    onReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DropdownMenu = () => (
    <Dropdown key="more" overlay={menu}>
      <Button style={{ border: "none", padding: 0 }}>
        <EllipsisOutlined style={{ fontSize: 20, verticalAlign: "top" }} />
      </Button>
    </Dropdown>
  );

  const TableHeader = () => (
    <PageHeader
      ghost={false}
      title="Students"
      subTitle={
        <Badge
          count={fetching ? 0 : students.length}
          className="site-badge-count-109"
        />
      }
      extra={[
        <Search
          key="1"
          placeholder="input search text"
          allowClear
          onSearch={(value, _) => onReload(value)}
          style={{ width: 250 }}
          enterButton
        />,
        <Button
          key="2"
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setShowDrawer(!showDrawer)}
        >
          Add Student
        </Button>,
        <DropdownMenu key="more" />,
      ]}
    />
  );

  const StudentTable = () => {
    console.log("render students");
    if (fetching) {
      return <Loading />;
    }
    return (
      <Table
        dataSource={students}
        columns={columns}
        bordered
        rowKey={(student) => student.id}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 300 }}
        title={() => <TableHeader />}
        footer={() => "Summary:"}
        size="small"
      />
    );
  };

  return (
    <>
      <StudentDrawerForm
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        studentToEdit={studentToEdit}
        setStudentToEdit={setStudentToEdit}
        fetchStudents={() => onReload()}
      />
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        <StudentTable />
      </div>
    </>
  );
}

export default StudentPage;
