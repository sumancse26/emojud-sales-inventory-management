import { cookies } from 'next/headers';
import { getEmployeeList, getDepartmentList, getDesignationList } from '@/services/employees';
import { getShopList } from '@/services/shop';
import { getRoleList } from '@/services/role';
import { getGenderList, getBloodGroupList } from '@/services/common';
import EmployeesFeature from './_feature';

export default async function Page() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
    const customHeaders = { Cookie: cookieStore.toString() };

    const [empRes, shopRes] = await Promise.all([
        getEmployeeList(customHeaders).catch(() => null),
        getShopList(customHeaders).catch(() => null)
    ]);

    const employees = empRes?.data ?? [];
    const shops = shopRes?.data ?? [];

    let departmentList = [];
    const dept = await getDepartmentList(customHeaders);
    departmentList = dept?.data || [];

    let designationList = [];
    const designations = await getDesignationList(customHeaders);
    designationList = designations?.data || [];

    let genderList = [];
    const genders = await getGenderList(customHeaders);
    genderList = genders?.data || [];

    let bloodGroupList = [];
    const bloodGroups = await getBloodGroupList(customHeaders);
    bloodGroupList = bloodGroups?.data || [];

    let roleList = [];
    const roles = await getRoleList(customHeaders);
    roleList = roles?.data || [];

    return <EmployeesFeature initialEmployees={employees} shops={shops} userInfo={userInfo} departmentList={departmentList} designationList={designationList} genderList={genderList} bloodGroupList={bloodGroupList} roleList={roleList} />;
}

