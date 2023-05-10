import React, { useState, useRef } from 'react';
import './index.less';
import { Button, Message } from 'adesign-react';
import {
    Addcircle as SvgAddcircle,
    Left as SvgLeft,
} from 'adesign-react/icons';
// import SendEmail from '@modals/SendEmail';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SvgSendEmail from '@assets/icons/SendEmail';
import SvgStop from '@assets/icons/Stop';
import Bus from '@utils/eventBus';
import { fetchStopReport } from '@services/report';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import { useSelector } from 'react-redux';
import InvitationModal from '@modals/ProjectInvitation';
import SvgSuccess from '@assets/logo/success';
import InputText from '@components/InputText';
import { fetchUpdateName } from '@services/report';

const ReportHeader = (props) => {
    const { data: { plan_name, scene_name, report_name }, status, plan_id } = props;
    const { t } = useTranslation();
    const [showSendEmail, setSendEmail] = useState(false);
    const navigate = useNavigate();
    const ref1 = useRef(null);
    const refs = [ref1];
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { id: report_id, contrast } = qs.parse(search.slice(1));
    const select_plan = useSelector((store) => (store.plan.select_plan));
    const handleExportPdf = async () => {
        // 根据dpi放大，防止图片模糊
        const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
        // 下载尺寸 a4 纸 比例
        const pdf = new jsPDF('p', 'pt', 'a4')
        for (let i in refs) {
            const toPdfRef = refs[i];
            let width = toPdfRef.current.offsetWidth;
            let height = toPdfRef.current.offsetHeight;

            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            const pdfCanvas = await html2canvas(toPdfRef.current, {
                useCORS: true,
                canvas,
                scale,
                width,
                height,
                x: 0,
                y: 0,
            });
            const imgDataUrl = pdfCanvas.toDataURL();

            if (height > 14400) { // 超出jspdf高度限制时
                const ratio = 14400 / height;
                height = 14400;
                width = width * ratio;
            }

            // 缩放为 a4 大小  pdfpdf.internal.pageSize 获取当前pdf设定的宽高
            height = height * pdf.internal.pageSize.getWidth() / width;
            width = pdf.internal.pageSize.getWidth();

            // pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
            pdf.addImage(imgDataUrl, 'png', 0, 0, width, height)

            // 若当前是最后一张截图，则不再另起一页，直接退出循环
            if (+i >= refs.length - 1) {
                break;
            }

            // 另起一页
            pdf.addPage();
        }

        // 导出下载 
        await pdf.save("pdf名", { returnPromise: true });
    }

    const donwloadReport = () => {
        const element = document.querySelector('.report');
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const offsetTop = element.offsetTop;
        const offsetLeft = element.offsetLeft;
        const canvas = document.createElement('canvas');
        let abs = 0;
        const win_i = document.body.clientWidth;
        const win_o = window.innerWidth;
        if (win_o > win_i) {
            abs = (win_o - win_i) / 2;
        };
        canvas.width = w * 2;
        canvas.height = h * 2;
        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.translate(-offsetLeft - abs, -offsetTop);
        html2canvas(element, {
            allowTaint: true,
            scale: 2
        }).then((canvas) => {
            const contentWidth = canvas.width;
            const contentHeight = canvas.height;
            const pageHeight = contentWidth / 592.28 * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            const imgWidth = 595.28;
            const imgHeight = 592.28 / contentWidth * contentHeight;
            const pageData = canvas.toDataURL('image/jpeg', 1.0);
            const str = '';
            const pdf = new jsPDF(str, 'pt', 'a4');

            if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
                while (leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                    leftHeight -= pageHeight;
                    position -= 841.89;

                    if (leftHeight > 0) {
                        pdf.addPage();
                    }
                }
            }
            pdf.save('123.pdf');
        })
    };

    const stopReport = () => {
        const params = {
            plan_id,
            team_id: localStorage.getItem('team_id'),
            report_ids: [report_id ? report_id : JSON.parse(contrast)[select_plan].report_id],
        };

        fetchStopReport(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.stopSuccess'));
                } else {
                    Message('error', t('message.stopError'));
                }
            }
        })
    }

    return (
        <>
            <div className='report-header' ref={ref1} style={{ paddingTop: report_id ? '0' : '20px' }}>
                <div className='report-header-left'>
                    <Button onClick={() => navigate('/report/list')}>
                        <SvgLeft />
                    </Button>
                    <div className='report-name'>
                        <InputText 
                            maxLength={61}
                            value={report_name}
                            placeholder={t('placeholder.reportName')}
                            onChange={(e) => {
                                if (e.trim().length > 0) {
                                    const params = {
                                        report_id,
                                        report_name: e.trim()
                                    };
                                    fetchUpdateName(params).subscribe();
                                }
                            }}
                        />    
                    </div>
                    <div className='report-status'>{status === 1 ? t('btn.running') : t('btn.done')}</div>
                </div>
                <div className='report-header-right'>
                    <Button className='notice' preFix={<SvgSendEmail width="16" height="16" />} onClick={() => setSendEmail(true)}>{t('btn.notifyEmail')}</Button>
                    {/* <Button className='download' onClick={() => donwloadReport()}>下载</Button> */}
                    {
                        status === 1
                            ? <Button className='stop' preFix={<SvgStop width="10" height="10" />} onClick={() => stopReport()}  >{t('btn.breakTask')}</Button>
                            : <Button className='finish' preFix={<SvgSuccess />}>{t('btn.done')}</Button>
                    }
                </div>
            </div>
            {showSendEmail && <InvitationModal from="report" email={true} onCancel={() => setSendEmail(false)} />}
        </>
    )
};

export default ReportHeader;